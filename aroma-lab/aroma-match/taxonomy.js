(() => {
  'use strict';

  const data = window.AROMA_MATCH_DATA;
  if (!data || !Array.isArray(data.compounds)) return;

  // Keep AROMA MATCH aligned with the canonical AROMA LAB drink taxonomy.
  // These lists mirror the current AROMA LAB standards sets exactly.
  const MEMBERSHIP = {
    sake: [
      'ethyl-acetate','isoamyl-acetate','ethyl-hexanoate','ethanol','isoamyl-alcohol',
      'phenethyl-alcohol','acetaldehyde','isovaleraldehyde','4vg','sotolon','ethanethiol',
      'dms','dmts','tca246','diacetyl','hexanoic-acid','acetic-acid','butyric-acid',
      'isovaleric-acid'
    ],
    shochu: [
      'isoamyl-acetate','ethyl-hexanoate','ethyl-acetate','phenethyl-alcohol','linalool',
      'beta-damascenone','vanillin','sotolon','edmp','furfural','4vg','dmts','acetic-acid',
      'diacetyl','acetaldehyde','isovaleraldehyde','isoamyl-alcohol','ethyl-laurate',
      'octenol','tca246'
    ],
    wine: [
      'furaneol','ibmp','linalool','3mh','beta-ionone','beta-damascenone','tdn',
      'isoamyl-acetate','isoamyl-alcohol','diacetyl','ethyl-acetate','4vp','4eg','2ap',
      'so2','tca246','eugenol','sotolon','hexadienol','cis3hexenol','geraniol',
      'ethyl-hexanoate','isobutanol','phenethyl-alcohol','h2s','ethanethiol','dms',
      'acetaldehyde','acetic-acid','butyric-acid','isovaleric-acid','4vg','4ep','athp',
      'geosmin','styrene','vanillin','guaiacol'
    ],
    beer: [
      'tca236','phenethyl-alcohol','3mbt','4vg','acetaldehyde','butyric-acid','diacetyl',
      'dms','ethyl-acetate','ethyl-hexanoate','trans2nonenal','citronellol','geraniol',
      'linalool','dcp26','ethanethiol','isoamyl-alcohol'
    ]
  };

  const sets = Object.fromEntries(
    Object.entries(MEMBERSHIP).map(([key, ids]) => [key, new Set(ids)])
  );

  data.compounds.forEach(compound => {
    compound.categories = Object.entries(sets)
      .filter(([, ids]) => ids.has(compound.id))
      .map(([key]) => key);
    compound.crossDrink = compound.categories.length >= 2;
  });

  const filters = [
    {id:'all', label:'ALL', ja:'全て', count:data.compounds.length},
    {id:'sake', label:'SAKE', ja:'日本酒', count:MEMBERSHIP.sake.length},
    {id:'shochu', label:'SHOCHU', ja:'焼酎・泡盛', count:MEMBERSHIP.shochu.length},
    {id:'wine', label:'WINE', ja:'ワイン', count:MEMBERSHIP.wine.length},
    {id:'beer', label:'BEER', ja:'ビール', count:MEMBERSHIP.beer.length},
    {id:'cross', label:'CROSS-DRINK', ja:'酒をまたぐ', count:data.compounds.filter(c => c.crossDrink).length}
  ];

  data.filters = filters;
  data.drinkMembership = MEMBERSHIP;
})();
