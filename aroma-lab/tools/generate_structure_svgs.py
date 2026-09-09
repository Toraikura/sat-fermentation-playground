#!/usr/bin/env python3
import argparse
import csv
import json
import re
import xml.etree.ElementTree as ET
from pathlib import Path

from rdkit import Chem
from rdkit.Chem import rdDepictor
from rdkit.Chem.Draw import rdMolDraw2D

WIDTH = 480
HEIGHT = 280
CENTER_X = WIDTH / 2
CENTER_Y = HEIGHT / 2
CENTER_TOLERANCE = 0.25

COLOR_SHORTCUTS = {
    "#000000": "#000",
    "#FF0000": "#f00",
    "#0000FF": "#00f",
    "#FFFF00": "#ff0",
    "#00CC00": "#0c0",
    "#7F7F7F": "#7f7f7f",
    "#00CCCC": "#0cc",
    "#FF7F00": "#f70",
}


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


def short_color(value):
    if value is None:
        return None
    value = value.strip()
    return COLOR_SHORTCUTS.get(value, value)


def compact_svg(svg: str) -> str:
    root = ET.fromstring(svg)
    paths = []

    for element in root.iter():
        if element.tag.split("}")[-1] != "path":
            continue

        path_data = element.attrib.get("d")
        if not path_data:
            continue

        attrs = [f"d={json.dumps(path_data)}"]
        style = element.attrib.get("style", "")
        fill = element.attrib.get("fill")
        stroke = None
        stroke_width = None

        if style:
            match = re.search(r"stroke:([^;]+)", style)
            if match:
                stroke = match.group(1)

            match = re.search(r"stroke-width:([^;]+)", style)
            if match:
                stroke_width = match.group(1)

            match = re.search(r"fill:([^;]+)", style)
            if match and not fill:
                fill = match.group(1)

        fill = short_color(fill)
        stroke = short_color(stroke)

        if fill:
            attrs.append(f"fill='{fill}'")
        elif stroke:
            attrs.append("fill='none'")

        if stroke:
            attrs.append(f"stroke='{stroke}'")

        if stroke_width:
            attrs.append(f"stroke-width='{stroke_width.replace('px', '')}'")

        paths.append("<path " + " ".join(attrs) + "/>")

    return (
        "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 280'>"
        + "".join(paths)
        + "</svg>"
    )


def draw_svg(smiles: str, compound_id: str) -> str:
    mol = molecule_from_smiles(smiles, compound_id)
    rdDepictor.Compute2DCoords(mol, canonOrient=True)

    drawer = rdMolDraw2D.MolDraw2DSVG(WIDTH, HEIGHT)
    options = drawer.drawOptions()
    options.padding = 0.10
    options.fixedFontSize = 20
    options.bondLineWidth = 2.0
    options.explicitMethyl = False
    options.clearBackground = False

    drawer.DrawMolecule(mol)
    drawer.FinishDrawing()
    return compact_svg(drawer.GetDrawingText())


def drawing_bbox(svg: str):
    root = ET.fromstring(svg)
    xs = []
    ys = []

    for element in root.iter():
        tag = element.tag.split("}")[-1]

        if tag == "path" and "d" in element.attrib:
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

        elif tag in {"circle", "ellipse"}:
            cx = float(element.attrib.get("cx", 0))
            cy = float(element.attrib.get("cy", 0))
            rx = float(element.attrib.get("r", element.attrib.get("rx", 0)))
            ry = float(element.attrib.get("r", element.attrib.get("ry", 0)))
            xs.extend([cx - rx, cx + rx])
            ys.extend([cy - ry, cy + ry])

        elif tag in {"polygon", "polyline"}:
            values = [
                float(value)
                for value in re.findall(
                    r"[-+]?\d*\.?\d+",
                    element.attrib.get("points", ""),
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
        smiles = row["smiles"]
        svg = draw_svg(smiles, compound_id)
        assert_centered(svg, compound_id)
        (args.output / f"{compound_id}.svg").write_text(svg, encoding="utf-8")

    print(f"Generated and centered {len(rows)} SVGs in {args.output}")


if __name__ == "__main__":
    main()
