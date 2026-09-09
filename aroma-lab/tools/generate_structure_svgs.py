#!/usr/bin/env python3
import argparse
import csv
import re
import xml.etree.ElementTree as ET
from pathlib import Path

from rdkit import Chem
from rdkit.Chem import rdDepictor
from rdkit.Chem.Draw import rdMolDraw2D
from rdkit.Geometry import Point3D

WIDTH = 480
HEIGHT = 280
CENTER_X = WIDTH / 2
CENTER_Y = HEIGHT / 2
CENTER_TOLERANCE = 1.0
FONT_SIZE = 38
BOND_LINE_WIDTH = 2.6
PADDING = 0.12
ATOM_LABEL_PADDING = 0.18
CARBONYL_SCALE = 1.18


def molecule_from_smiles(smiles: str, compound_id: str):
    if compound_id == "h2s":
        mol = Chem.MolFromSmiles(smiles, sanitize=False)
        if mol is None:
            raise ValueError("Could not parse explicit H2S structure")
        Chem.SanitizeMol(mol)
        if mol.GetNumAtoms() != 3 or mol.GetNumBonds() != 2:
            raise ValueError("H2S must remain explicit H-S-H")
        return mol

    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        raise ValueError(f"Could not parse {compound_id}: {smiles}")
    return mol


def elongate_carbonyls(mol):
    """Lengthen only C=O bonds by moving the O atom away from carbon.

    This is a readability adjustment to the 2D depiction only. Connectivity,
    bond order, stereochemistry, and the accepted structure identity are unchanged.
    """
    conf = mol.GetConformer()
    for bond in mol.GetBonds():
        if bond.GetBondType() != Chem.BondType.DOUBLE:
            continue

        begin = bond.GetBeginAtom()
        end = bond.GetEndAtom()
        if begin.GetAtomicNum() == 6 and end.GetAtomicNum() == 8:
            carbon_idx, oxygen_idx = begin.GetIdx(), end.GetIdx()
        elif end.GetAtomicNum() == 6 and begin.GetAtomicNum() == 8:
            carbon_idx, oxygen_idx = end.GetIdx(), begin.GetIdx()
        else:
            continue

        carbon = conf.GetAtomPosition(carbon_idx)
        oxygen = conf.GetAtomPosition(oxygen_idx)
        dx = oxygen.x - carbon.x
        dy = oxygen.y - carbon.y
        conf.SetAtomPosition(
            oxygen_idx,
            Point3D(
                carbon.x + dx * CARBONYL_SCALE,
                carbon.y + dy * CARBONYL_SCALE,
                0.0,
            ),
        )


def strip_xml_preamble(svg: str) -> str:
    svg = svg.strip()
    if svg.startswith("<?xml"):
        svg = svg.split("?>", 1)[1].strip()
    return svg


def draw_svg(smiles: str, compound_id: str) -> str:
    mol = molecule_from_smiles(smiles, compound_id)
    rdDepictor.Compute2DCoords(mol, canonOrient=True)
    elongate_carbonyls(mol)

    drawer = rdMolDraw2D.MolDraw2DSVG(WIDTH, HEIGHT)
    options = drawer.drawOptions()
    options.padding = PADDING
    options.fixedFontSize = FONT_SIZE
    options.additionalAtomLabelPadding = ATOM_LABEL_PADDING
    options.bondLineWidth = BOND_LINE_WIDTH
    options.explicitMethyl = False
    options.clearBackground = False
    options.useBWAtomPalette()

    drawer.SetFontSize(FONT_SIZE)
    drawer.DrawMolecule(mol)
    drawer.FinishDrawing()
    return strip_xml_preamble(drawer.GetDrawingText())


def drawing_bbox(svg: str):
    root = ET.fromstring(svg)
    xs = []
    ys = []

    for element in root.iter():
        tag = element.tag.split("}")[-1]
        if tag != "path" or "d" not in element.attrib:
            continue

        values = [
            float(value)
            for value in re.findall(
                r"[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?",
                element.attrib["d"],
            )
        ]
        for index in range(0, len(values) - 1, 2):
            xs.append(values[index])
            ys.append(values[index + 1])

    if not xs or not ys:
        raise ValueError("SVG contains no drawable molecular geometry")

    return min(xs), min(ys), max(xs), max(ys)


def assert_centered(svg: str, compound_id: str):
    left, top, right, bottom = drawing_bbox(svg)
    center_x = (left + right) / 2
    center_y = (top + bottom) / 2

    if abs(center_x - CENTER_X) > CENTER_TOLERANCE:
        raise ValueError(
            f"{compound_id}: horizontal bbox center {center_x:.2f} != {CENTER_X:.2f}"
        )

    if abs(center_y - CENTER_Y) > CENTER_TOLERANCE:
        raise ValueError(
            f"{compound_id}: vertical bbox center {center_y:.2f} != {CENTER_Y:.2f}"
        )


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--ledger",
        type=Path,
        default=Path(__file__).resolve().parents[1] / "STRUCTURE_SOURCE_LEDGER.csv",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path(__file__).resolve().parents[1] / "assets" / "structures",
    )
    args = parser.parse_args()

    with args.ledger.open(newline="", encoding="utf-8") as handle:
        rows = list(csv.DictReader(handle))

    if len(rows) != 51:
        raise ValueError(f"Expected 51 ledger rows, got {len(rows)}")

    args.output.mkdir(parents=True, exist_ok=True)

    for row in rows:
        compound_id = row["id"]
        svg = draw_svg(row["smiles"], compound_id)
        assert_centered(svg, compound_id)
        (args.output / f"{compound_id}.svg").write_text(svg, encoding="utf-8")

    print(
        f"Generated {len(rows)} all-black SVGs: font={FONT_SIZE}, "
        f"bond={BOND_LINE_WIDTH}, carbonyl-scale={CARBONYL_SCALE}"
    )


if __name__ == "__main__":
    main()
