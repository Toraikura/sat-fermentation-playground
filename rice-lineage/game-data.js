(()=>{
'use strict';
const choices={
  mutation:{id:'event-mutation',ja:'突然変異',en:'MUTATION',kind:'event'},
  cross:{id:'event-cross',ja:'交配',en:'CROSS',kind:'event'},
  origin:{id:'event-origin',ja:'ここが起点',en:'ORIGIN / GOAL',kind:'event'}
};

const nodes={
  'tottori-landrace':{id:'tottori-landrace',ja:'鳥取在来種',en:'TOTTORI LANDRACE',region:'鳥取'},
  'dewa-sansan':{id:'dewa-sansan',ja:'出羽燦々',en:'DEWA SAN-SAN',region:'山形'},
  'hana-fubuki':{id:'hana-fubuki',ja:'華吹雪',en:'HANA FUBUKI',region:'青森系'},
  'akita-sake-komachi':{id:'akita-sake-komachi',ja:'秋田酒こまち',en:'AKITA SAKE KOMACHI',region:'秋田'},
  'akikei-sake251':{id:'akikei-sake251',ja:'秋系酒251',en:'AKIKEI SAKE 251',region:'秋田育種系'},
  'akikei-sake306':{id:'akikei-sake306',ja:'秋系酒306',en:'AKIKEI SAKE 306',region:'秋田育種系'},
  'ginpu':{id:'ginpu',ja:'吟風',en:'GINPU',region:'北海道'},
  'ginpu-f1':{id:'ginpu-f1',ja:'中間F1系統',en:'HATTAN NISHIKI 2 × JOUIKU 404 F1',region:'北海道育種系'},
  'hattan-nishiki-2':{id:'hattan-nishiki-2',ja:'八反錦2号',en:'HATTAN NISHIKI NO.2',region:'広島系'},
  'jouiku404':{id:'jouiku404',ja:'上育404号',en:'JOUIKU 404',region:'北海道育種系'},
  'kirara397':{id:'kirara397',ja:'きらら397',en:'KIRARA 397',region:'北海道'},
  'yukimegami':{id:'yukimegami',ja:'雪女神',en:'YUKIMEGAMI',region:'山形'},
  'dewa-no-sato':{id:'dewa-no-sato',ja:'出羽の里',en:'DEWA NO SATO',region:'山形'},
  'kura-no-hana':{id:'kura-no-hana',ja:'蔵の華',en:'KURA NO HANA',region:'宮城'}
};

const sources={
  g1:{tier:'A',org:'山形県',title:'山形県育成品種の紹介：出羽燦々・雪女神',url:'https://www.pref.yamagata.jp/documents/3639/h.30hinnsyu_sakumotu'},
  g2:{tier:'A',org:'秋田県農業試験場',title:'水稲新品種「秋田酒こまち」の育成',url:'https://www.pref.akita.lg.jp/uploads/public/archive_0000005709_00/kenkyuhokoku46-1.pdf'},
  g3:{tier:'A',org:'北海道立総合研究機構',title:'酒造好適米新品種「吟風」の育成',url:'https://www.hro.or.jp/agricultural/center/publication/syuhou/2k/82-1.html'}
};

const missions=[
  {
    id:'yamada-nishiki',target:'yamada-nishiki',world:'roots',region:'HYOGO',difficulty:1,
    summary:'山田錦の親と、その先のルーツを探しに行く。',
    learn:'山田錦は山田穂と短稈渡船の交配から生まれた。短稈渡船は雄町から株選抜された系統。',
    route:['yamada-ho','tankan-wataribune','omachi'],
    questions:[
      {current:'yamada-nishiki',prompt:'山田錦の親はどっち？',sub:'Find one documented parent.',correct:'yamada-ho',wrong:'gohyakumangoku'},
      {current:'yamada-nishiki',prompt:'もう一人の親はどっち？',sub:'Find the other documented parent.',correct:'tankan-wataribune',wrong:'kikusui'},
      {current:'tankan-wataribune',prompt:'短稈渡船はどこから？',sub:'Which variety was it selected from?',correct:'omachi',wrong:'takane-nishiki'}
    ]
  },
  {
    id:'hattan-nishiki-1',target:'hattan-nishiki-1',world:'roots',region:'HIROSHIMA',difficulty:1,
    summary:'八反錦1号の二つの親を当てる短距離ステージ。',
    learn:'八反錦1号は八反35号とアキツホを1973年に交配し、1984年に広島県の奨励品種となった。',
    route:['hattan35','akitsuho'],
    questions:[
      {current:'hattan-nishiki-1',prompt:'八反錦1号の親はどっち？',sub:'Find one documented parent.',correct:'hattan35',wrong:'yamada-nishiki'},
      {current:'hattan-nishiki-1',prompt:'もう一人の親はどっち？',sub:'Complete the Hattan Nishiki branch.',correct:'akitsuho',wrong:'gohyakumangoku'}
    ]
  },
  {
    id:'gohyakumangoku',target:'gohyakumangoku',world:'roots',region:'NIIGATA',difficulty:2,
    summary:'五百万石の両親から、雄町へつながる枝をたどる。',
    learn:'五百万石は菊水と新200号の交配から育成された。菊水は中支旭と雄町を親に持つ。',
    route:['kikusui','shin200','omachi','chushi-asahi'],
    questions:[
      {current:'gohyakumangoku',prompt:'五百万石の親はどっち？',sub:'Find one documented parent.',correct:'kikusui',wrong:'yamada-nishiki'},
      {current:'gohyakumangoku',prompt:'もう一人の親はどっち？',sub:'Find the other documented parent.',correct:'shin200',wrong:'tankan-wataribune'},
      {current:'kikusui',prompt:'菊水の親はどっち？',sub:'Trace one step further back.',correct:'omachi',wrong:'takane-nishiki'},
      {current:'kikusui',prompt:'菊水のもう一人の親は？',sub:'Complete the Kikusui branch.',correct:'chushi-asahi',wrong:'yamada-ho'}
    ]
  },
  {
    id:'miyama-nishiki',target:'miyama-nishiki',world:'roots',region:'NAGANO',difficulty:2,special:'MUTATION',
    summary:'普通の交配ではない、美山錦の特殊なルーツを走る。',
    learn:'美山錦は、たかね錦へのガンマ線照射による突然変異育種から生まれた。',
    route:['takane-nishiki'],
    questions:[
      {current:'miyama-nishiki',prompt:'美山錦の元になった米は？',sub:'Find the documented source variety.',correct:'takane-nishiki',wrong:'yamada-nishiki'},
      {current:'miyama-nishiki',kicker:'SPECIAL / MUTATION',prompt:'美山錦が生まれた方法は？',sub:'Cross or mutation?',correct:choices.mutation,wrong:choices.cross}
    ]
  },
  {
    id:'koshi-tanrei',target:'koshi-tanrei',world:'crossroads',region:'NIIGATA',difficulty:3,
    summary:'新潟の越淡麗から、山田錦と五百万石へ分かれる道を走る。',
    learn:'越淡麗は山田錦と五百万石を親に持つ。二つの大きな酒米系統がここで合流する。',
    route:['yamada-nishiki','gohyakumangoku','tankan-wataribune','kikusui'],
    questions:[
      {current:'koshi-tanrei',prompt:'越淡麗の親はどっち？',sub:'Find one documented parent.',correct:'yamada-nishiki',wrong:'miyama-nishiki'},
      {current:'koshi-tanrei',prompt:'もう一人の親はどっち？',sub:'Find the other documented parent.',correct:'gohyakumangoku',wrong:'goriki'},
      {current:'yamada-nishiki',prompt:'山田錦の親へ戻れ！',sub:'Trace the Yamada Nishiki branch.',correct:'tankan-wataribune',wrong:'kikusui'},
      {current:'gohyakumangoku',prompt:'五百万石の親へ戻れ！',sub:'Trace the Gohyakumangoku branch.',correct:'kikusui',wrong:'omachi'}
    ]
  },
  {
    id:'kinmon-nishiki',target:'kinmon-nishiki',world:'crossroads',region:'NAGANO',difficulty:3,
    summary:'たかね錦と山田錦、二つの系統をまたいで遡る。',
    learn:'金紋錦はたかね錦と山田錦を親に持つ。美山錦ステージで出会った、たかね錦が再登場する。',
    route:['takane-nishiki','yamada-nishiki','tankan-wataribune','omachi'],
    questions:[
      {current:'kinmon-nishiki',prompt:'金紋錦の親はどっち？',sub:'Find one documented parent.',correct:'takane-nishiki',wrong:'gohyakumangoku'},
      {current:'kinmon-nishiki',prompt:'もう一人の親はどっち？',sub:'Find the other documented parent.',correct:'yamada-nishiki',wrong:'omachi'},
      {current:'yamada-nishiki',prompt:'山田錦の親へ戻れ！',sub:'Keep tracing the lineage.',correct:'tankan-wataribune',wrong:'kikusui'},
      {current:'tankan-wataribune',prompt:'短稈渡船のルーツは？',sub:'One more step back.',correct:'omachi',wrong:'takane-nishiki'}
    ]
  },
  {
    id:'aiyama',target:'aiyama',world:'crossroads',region:'HYOGO',difficulty:3,
    summary:'愛山から山雄67へ入り、山田錦と雄町の合流点まで戻る。',
    learn:'愛山は愛船117と山雄67を親に持つ。山雄67は山田錦と雄町を親に持つため、愛山は山田錦の直子ではなく子孫。',
    route:['aisen117','yamayu67','yamada-nishiki','omachi'],
    questions:[
      {current:'aiyama',prompt:'愛山の親はどっち？',sub:'Find one documented parent.',correct:'aisen117',wrong:'gohyakumangoku'},
      {current:'aiyama',prompt:'もう一人の親はどっち？',sub:'Find the other documented parent.',correct:'yamayu67',wrong:'miyama-nishiki'},
      {current:'yamayu67',prompt:'山雄67の親はどっち？',sub:'Trace one branch backward.',correct:'yamada-nishiki',wrong:'kikusui'},
      {current:'yamayu67',prompt:'山雄67のもう一人の親は？',sub:'Complete the branch.',correct:'omachi',wrong:'goriki'}
    ]
  },
  {
    id:'goriki',target:'goriki',world:'crossroads',region:'TOTTORI',difficulty:2,special:'ORIGIN',
    summary:'親を無理につながない。強力の「起点」を見つける特殊ステージ。',
    learn:'強力は鳥取の在来種から選抜された酒米。確認できない親へはつながず、ここを系譜上の起点として扱う。',
    route:['tottori-landrace'],
    questions:[
      {current:'goriki',prompt:'強力のルーツは？',sub:'Trace the documented origin.',correct:'tottori-landrace',wrong:'yamada-nishiki'},
      {current:'tottori-landrace',kicker:'SPECIAL / ORIGIN',prompt:'さらに親へ進む？',sub:'Sometimes the correct road is the end.',correct:choices.origin,wrong:'omachi'}
    ]
  },
  {
    id:'dewa-sansan',target:'dewa-sansan',world:'north',region:'YAMAGATA',difficulty:3,
    summary:'山形の出羽燦々から、美山錦の系譜へ戻っていく。',
    learn:'出羽燦々は美山錦と華吹雪の交配から育成された。美山錦をさらに遡ると、たかね錦へつながる。',
    route:['miyama-nishiki','hana-fubuki','takane-nishiki'],
    questions:[
      {current:'dewa-sansan',prompt:'出羽燦々の親はどっち？',sub:'Find one documented parent.',correct:'miyama-nishiki',wrong:'yamada-nishiki'},
      {current:'dewa-sansan',prompt:'もう一人の親はどっち？',sub:'Find the other documented parent.',correct:'hana-fubuki',wrong:'akita-sake-komachi'},
      {current:'miyama-nishiki',prompt:'美山錦をさらに遡れ！',sub:'You have seen this route before.',correct:'takane-nishiki',wrong:'omachi'}
    ]
  },
  {
    id:'akita-sake-komachi',target:'akita-sake-komachi',world:'north',region:'AKITA',difficulty:2,
    summary:'秋田酒こまちの二つの育種系統を見つけるショートコース。',
    learn:'秋田酒こまちは、秋系酒251を母、秋系酒306を父として1992年に人工交配した後代から育成された。',
    route:['akikei-sake251','akikei-sake306'],
    questions:[
      {current:'akita-sake-komachi',prompt:'秋田酒こまちの親は？',sub:'Find one breeding line.',correct:'akikei-sake251',wrong:'miyama-nishiki'},
      {current:'akita-sake-komachi',prompt:'もう一人の親は？',sub:'Complete the short course.',correct:'akikei-sake306',wrong:'yamada-nishiki'}
    ]
  },
  {
    id:'ginpu',target:'ginpu',world:'north',region:'HOKKAIDO',difficulty:4,special:'COMPLEX CROSS',
    summary:'二段階の交配をほどく、北海道の複雑ルート。',
    learn:'吟風は、八反錦2号と上育404号のF1を母、きらら397を父として交配した後代から育成された。',
    route:['kirara397','ginpu-f1','hattan-nishiki-2','jouiku404'],
    questions:[
      {current:'ginpu',prompt:'吟風の親ルートは？',sub:'Find one side of the final cross.',correct:'kirara397',wrong:'gohyakumangoku'},
      {current:'ginpu',prompt:'もう一方の親ルートは？',sub:'This road hides an F1 cross.',correct:'ginpu-f1',wrong:'hattan-nishiki-1'},
      {current:'ginpu-f1',kicker:'SPECIAL / COMPLEX CROSS',prompt:'中間F1の親は？',sub:'Open the hidden branch.',correct:'hattan-nishiki-2',wrong:'hattan-nishiki-1'},
      {current:'ginpu-f1',prompt:'F1のもう一人の親は？',sub:'Complete the complex cross.',correct:'jouiku404',wrong:'shin200'}
    ]
  },
  {
    id:'saga-no-hana',target:'saga-no-hana',world:'deep',region:'SAGA',difficulty:4,
    summary:'山田錦系と五百万石系を一つの面で横断する。',
    learn:'さがの華は若水と山田錦を親に持つ。若水は、あ系酒101と五百万石の交配から生まれた。',
    route:['wakamizu','yamada-nishiki','gohyakumangoku','a-kei-sake101'],
    questions:[
      {current:'saga-no-hana',prompt:'さがの華の親は？',sub:'Find one documented parent.',correct:'wakamizu',wrong:'jugemu'},
      {current:'saga-no-hana',prompt:'もう一人の親は？',sub:'Find the other documented parent.',correct:'yamada-nishiki',wrong:'miyama-nishiki'},
      {current:'wakamizu',prompt:'若水の親は？',sub:'Cross into the Gohyakumangoku line.',correct:'gohyakumangoku',wrong:'omachi'},
      {current:'wakamizu',prompt:'若水のもう一人の親は？',sub:'Finish the branch.',correct:'a-kei-sake101',wrong:'shin200'}
    ]
  },
  {
    id:'yukimegami',target:'yukimegami',world:'deep',region:'YAMAGATA',difficulty:3,
    summary:'最終面の前に走る、山形の短距離スプリント。',
    learn:'雪女神は出羽の里を母、蔵の華を父として交配し育成された、大吟醸酒向けの山形県オリジナル酒米。',
    route:['dewa-no-sato','kura-no-hana'],
    questions:[
      {current:'yukimegami',prompt:'雪女神の親は？',sub:'Find one documented parent.',correct:'dewa-no-sato',wrong:'dewa-sansan'},
      {current:'yukimegami',prompt:'もう一人の親は？',sub:'One more turn before the final.',correct:'kura-no-hana',wrong:'hana-fubuki'}
    ]
  },
  {
    id:'gin-no-sato',target:'gin-no-sato',world:'deep',region:'KYUSHU',difficulty:5,special:'REPEATED ANCESTOR',
    summary:'同じ山田錦が、別ルートから二度現れる最終ステージ。',
    learn:'吟のさとは山田錦と西海222号を親に持つ。西海222号自体も山田錦と89H624を親に持つため、山田錦が別ルートから二度現れる。',
    route:['yamada-nishiki','saikai222','yamada-nishiki','89h624','tankan-wataribune'],
    questions:[
      {current:'gin-no-sato',prompt:'吟のさとの親は？',sub:'FINAL BOSS begins.',correct:'yamada-nishiki',wrong:'gohyakumangoku'},
      {current:'gin-no-sato',prompt:'もう一人の親は？',sub:'Find the second direct parent.',correct:'saikai222',wrong:'saikai134'},
      {current:'saikai222',kicker:'FINAL / REPEATED ANCESTOR',prompt:'西海222号の親は？',sub:'The same ancestor appears again.',correct:'yamada-nishiki',wrong:'gohyakumangoku'},
      {current:'saikai222',prompt:'もう一人の親は？',sub:'Complete the Saikai 222 branch.',correct:'89h624',wrong:'shiranui'},
      {current:'yamada-nishiki',prompt:'山田錦をさらに遡れ！',sub:'One final checkpoint.',correct:'tankan-wataribune',wrong:'kikusui'}
    ]
  }
];

const worlds=[
  {id:'roots',label:'WORLD 1',name:'ROOTS',ja:'はじまり',missions:['yamada-nishiki','hattan-nishiki-1','gohyakumangoku','miyama-nishiki'],layout:{'yamada-nishiki':[14,72],'hattan-nishiki-1':[37,39],'gohyakumangoku':[61,70],'miyama-nishiki':[84,34]}},
  {id:'crossroads',label:'WORLD 2',name:'CROSSROADS',ja:'交差点',missions:['koshi-tanrei','kinmon-nishiki','aiyama','goriki'],layout:{'koshi-tanrei':[14,70],'kinmon-nishiki':[38,36],'aiyama':[62,69],'goriki':[85,35]}},
  {id:'north',label:'WORLD 3',name:'NORTH',ja:'北へ',missions:['dewa-sansan','akita-sake-komachi','ginpu'],layout:{'dewa-sansan':[16,70],'akita-sake-komachi':[50,34],'ginpu':[84,70]}},
  {id:'deep',label:'WORLD 4',name:'DEEP LINEAGE',ja:'深い系譜',missions:['saga-no-hana','yukimegami','gin-no-sato'],layout:{'saga-no-hana':[16,70],'yukimegami':[50,34],'gin-no-sato':[84,70]}}
];

window.RICE_LINEAGE_GAME_DATA={version:'2.0.0',reviewed:'2026-09-11',choices,nodes,sources,missions,worlds};
})();
