(() => {
  'use strict';

  const AROMA_LABELS = {
    'aroma-alcohol-sake':'酒・アルコール',
    'aroma-aonori':'青海苔',
    'aroma-apple-green':'青リンゴ',
    'aroma-apple-red':'リンゴ',
    'aroma-banana':'バナナ',
    'aroma-caramel':'カラメル',
    'aroma-cardboard-old-paper':'段ボール・古紙',
    'aroma-cheese':'チーズ',
    'aroma-clove':'クローブ',
    'aroma-cooking-oil':'油',
    'aroma-cork':'コルク',
    'aroma-corn':'コーン',
    'aroma-corn-soup':'コーンスープ',
    'aroma-fermented-butter':'発酵バター',
    'aroma-gas':'ガス',
    'aroma-ginkgo-nut':'銀杏',
    'aroma-glue-remover':'接着剤・除光液系',
    'aroma-grapefruit':'グレープフルーツ',
    'aroma-grass':'草',
    'aroma-green-aldehydic':'青臭い・アルデヒド系',
    'aroma-green-pepper':'ピーマン',
    'aroma-honey':'蜂蜜',
    'aroma-ink':'インク',
    'aroma-kerosene':'灯油',
    'aroma-lavender':'ラベンダー',
    'aroma-match-sulfite':'マッチ・亜硫酸',
    'aroma-mold':'カビ',
    'aroma-mouse':'ネズミ臭',
    'aroma-mureka-musty-steam':'ムレ香',
    'aroma-mushroom':'キノコ',
    'aroma-natto':'納豆',
    'aroma-nuts':'ナッツ',
    'aroma-oak-barrel':'オーク樽',
    'aroma-onion':'玉ねぎ',
    'aroma-phenol':'フェノール',
    'aroma-pickles':'漬物',
    'aroma-plastic':'プラスチック',
    'aroma-resin':'樹脂',
    'aroma-rose':'バラ',
    'aroma-rotten-egg':'腐った卵',
    'aroma-skunk':'スカンク',
    'aroma-smoke':'煙',
    'aroma-smoked':'燻製',
    'aroma-smoky-charred':'焦げ',
    'aroma-soap':'石鹸',
    'aroma-soil':'土',
    'aroma-solvent':'溶剤',
    'aroma-spice':'香辛料',
    'aroma-stable-animal':'馬小屋・獣臭',
    'aroma-strawberry-candy':'イチゴキャンディ',
    'aroma-sweat':'汗',
    'aroma-sweet-flower':'甘い花',
    'aroma-takuan':'たくあん',
    'aroma-vanilla':'バニラ',
    'aroma-vinegar':'酢',
    'aroma-violet':'スミレ',
    'aroma-whiteboard-marker':'ホワイトボードマーカー',
    'aroma-young-green-leaves':'青葉',
    'aroma-yogurt':'ヨーグルト'
  };

  // Source: the 51 compound rows in ../app.js plus the final image mapping in
  // ../hotfix-name-first.js. aromaIds are normalized concepts so a later EXPERT
  // mode can match one aroma concept to multiple compounds without changing schema.
  const ROWS = [
    ['ethyl-acetate','酢酸エチル','Ethyl acetate','ESTER','除光液・接着剤様 / エステル',['aroma-glue-remover']],
    ['isoamyl-acetate','酢酸イソアミル','Isoamyl acetate','ESTER','バナナ / 吟醸香',['aroma-banana']],
    ['ethyl-hexanoate','カプロン酸エチル','Ethyl hexanoate','ESTER','リンゴ / 吟醸香',['aroma-apple-red']],
    ['ethanol','エタノール','Ethanol','ALCOHOL','酒類の主成分となるアルコール',['aroma-alcohol-sake']],
    ['isoamyl-alcohol','イソアミルアルコール','Isoamyl alcohol','ALCOHOL','インク・マーカー / フーゼル',['aroma-whiteboard-marker','aroma-ink']],
    ['phenethyl-alcohol','フェネチルアルコール','2-Phenylethanol','ALCOHOL','バラ / 甘い花',['aroma-rose','aroma-sweet-flower']],
    ['acetaldehyde','アセトアルデヒド','Acetaldehyde','ALDEHYDE','青リンゴ・木・草',['aroma-apple-green','aroma-green-aldehydic']],
    ['isovaleraldehyde','イソバレルアルデヒド','3-Methylbutanal','ALDEHYDE','ムレ香 / 刺激的',['aroma-mureka-musty-steam']],
    ['4vg','4-ビニルグアイアコール（4VG）','4-Vinylguaiacol','PHENOL','燻製・香辛料 / クローブ',['aroma-smoked','aroma-clove']],
    ['sotolon','ソトロン','Sotolon','FURANONE','カラメル・熟成の甘さ',['aroma-caramel']],
    ['ethanethiol','エタンチオール','Ethanethiol','SULFUR','玉ねぎ・ガス / 硫黄',['aroma-onion','aroma-gas']],
    ['dms','ジメチルスルフィド','Dimethyl sulfide','SULFUR','青海苔・コーンスープ',['aroma-aonori','aroma-corn-soup']],
    ['dmts','ジメチルトリスルフィド','Dimethyl trisulfide','SULFUR','たくあん・漬物',['aroma-takuan','aroma-pickles']],
    ['tca246','2,4,6-トリクロロアニソール','2,4,6-Trichloroanisole','HALOAROMATIC','カビ・コルク臭',['aroma-cork','aroma-mold']],
    ['diacetyl','ジアセチル','Diacetyl','DIKETONE','発酵バター・ヨーグルト',['aroma-fermented-butter','aroma-yogurt']],
    ['hexanoic-acid','ヘキサン酸','Hexanoic acid','ACID','油・樹脂様',['aroma-cooking-oil','aroma-resin']],
    ['acetic-acid','酢酸','Acetic acid','ACID','酢・酸臭',['aroma-vinegar']],
    ['butyric-acid','酪酸','Butyric acid','ACID','チーズ・銀杏',['aroma-cheese','aroma-ginkgo-nut']],
    ['isovaleric-acid','イソ吉草酸','Isovaleric acid','ACID','納豆・汗様',['aroma-natto','aroma-sweat']],
    ['linalool','リナロール','Linalool','TERPENE ALCOHOL','ラベンダー・フローラル',['aroma-lavender']],
    ['beta-damascenone','β-ダマセノン','β-Damascenone','NORISOPRENOID','蜂蜜・熟した果実',['aroma-honey']],
    ['vanillin','バニリン','Vanillin','PHENOLIC ALDEHYDE','バニラ',['aroma-vanilla','aroma-oak-barrel']],
    ['edmp','2-エチル-3,5-ジメチルピラジン','2-Ethyl-3,5-dimethylpyrazine','PYRAZINE','ナッツ・ロースト',['aroma-nuts']],
    ['furfural','フルフラール','Furfural','FURAN ALDEHYDE','煙・トースト',['aroma-smoke','aroma-smoky-charred']],
    ['ethyl-laurate','ラウリン酸エチル','Ethyl laurate','ESTER','石鹸様',['aroma-soap']],
    ['octenol','1-オクテン-3-オール','1-Octen-3-ol','ALCOHOL','キノコ・土',['aroma-mushroom','aroma-soil']],
    ['furaneol','4-ヒドロキシ-2,5-ジメチル-3(2H)-フラノン','Furaneol / HDMF','FURANONE','いちご・カラメル',['aroma-strawberry-candy','aroma-caramel']],
    ['ibmp','2-イソブチル-3-メトキシピラジン','IBMP','PYRAZINE','青ピーマン・青い植物',['aroma-green-pepper','aroma-young-green-leaves']],
    ['3mh','3-メルカプトヘキサノール','3-Mercaptohexan-1-ol / 3MH','SULFUR ALCOHOL','グレープフルーツ・パッションフルーツ',['aroma-grapefruit']],
    ['beta-ionone','β-イオノン','β-Ionone','NORISOPRENOID','スミレ・フローラル',['aroma-violet']],
    ['tdn','1,1,6-トリメチル-1,2-ジヒドロナフタレン','TDN','AROMATIC','灯油・ペトロール様',['aroma-kerosene']],
    ['4vp','4-ビニルフェノール','4-Vinylphenol / 4VP','PHENOL','薬品・フェノール様',['aroma-phenol']],
    ['4eg','4-エチルグアイアコール','4-Ethylguaiacol / 4EG','PHENOL','スモーキー・スパイス',['aroma-smoked','aroma-spice']],
    ['2ap','2-アセチル-1-ピロリン','2-Acetyl-1-pyrroline','HETEROCYCLE','ポップコーン・炒った穀物',['aroma-corn']],
    ['so2','二酸化硫黄','Sulfur dioxide','SULFUR OXIDE','刺激的な硫黄・マッチ様',['aroma-match-sulfite']],
    ['eugenol','オイゲノール','Eugenol','PHENOL','クローブ・スパイス',['aroma-clove','aroma-spice']],
    ['hexadienol','trans,trans-2,4-ヘキサジエノール','trans,trans-2,4-Hexadien-1-ol','ALCOHOL','青い植物・グリーン',['aroma-green-aldehydic','aroma-young-green-leaves']],
    ['cis3hexenol','cis-3-ヘキセノール','cis-3-Hexen-1-ol','ALCOHOL','刈った草・青葉',['aroma-grass','aroma-young-green-leaves']],
    ['geraniol','ゲラニオール','Geraniol','TERPENE ALCOHOL','バラ・ゼラニウム',['aroma-rose']],
    ['isobutanol','イソブタノール','Isobutanol','ALCOHOL','フーゼル・アルコール',['aroma-alcohol-sake','aroma-solvent']],
    ['h2s','硫化水素','Hydrogen sulfide','SULFUR','腐卵・還元臭',['aroma-rotten-egg']],
    ['4ep','4-エチルフェノール','4-Ethylphenol / 4EP','PHENOL','動物・フェノール様',['aroma-stable-animal','aroma-phenol']],
    ['athp','2-アセチル-3,4,5,6-テトラヒドロピリジン','ATHP','HETEROCYCLE','ネズミ臭・穀物様',['aroma-mouse']],
    ['geosmin','ジオスミン','Geosmin','TERPENOID','土・雨上がり',['aroma-soil']],
    ['styrene','スチレン','Styrene','AROMATIC','プラスチック・樹脂様',['aroma-plastic','aroma-resin']],
    ['guaiacol','グアイアコール','Guaiacol','PHENOL','煙・フェノール',['aroma-smoke','aroma-phenol']],
    ['tca236','2,3,6-トリクロロアニソール','2,3,6-Trichloroanisole','HALOAROMATIC','カビ・湿った紙様',['aroma-mold','aroma-cardboard-old-paper']],
    ['3mbt','3-メチル-2-ブテン-1-チオール','3-Methyl-2-buten-1-thiol','SULFUR','日光臭・スカンキー',['aroma-skunk']],
    ['trans2nonenal','trans-2-ノネナール','trans-2-Nonenal','ALDEHYDE','段ボール・紙・老化臭',['aroma-cardboard-old-paper']],
    ['citronellol','シトロネロール','Citronellol','TERPENE ALCOHOL','シトラス・バラ',['aroma-rose','aroma-grapefruit']],
    ['dcp26','2,6-ジクロロフェノール','2,6-Dichlorophenol','HALOPHENOL','薬品・消毒様',['aroma-phenol']]
  ];

  const compounds = ROWS.map(([id,ja,en,family,aroma,aromaIds]) => ({
    id, ja, en, family, aroma, aromaIds: aromaIds.slice(),
    structure: `../assets/structures/${id}.svg`
  }));

  const aromas = Object.entries(AROMA_LABELS).map(([id,label]) => ({
    id,
    label,
    image: `../assets/aroma-lab/master/${id}.png`
  }));

  const links = compounds.flatMap(compound => compound.aromaIds.map(aromaId => ({
    compoundId: compound.id,
    aromaId,
    relation: 'sensory-reference'
  })));

  window.AROMA_MATCH_DATA = {
    schemaVersion: 1,
    compounds,
    aromas,
    links
  };
})();
