(() => {
  'use strict';

  const data = window.AROMA_MATCH_DATA;
  if (!data || !Array.isArray(data.aromas)) return;

  data.aromas.forEach(aroma => {
    aroma.image = aroma.image
      .replace('../assets/aroma-lab/master/', '../assets/aroma-lab/thumbs/')
      .replace(/\.png$/i, '.webp');
  });
})();
