(() => {
  function rewriteImage(img){
    if(!img || !img.classList || !img.classList.contains('final-aroma-img')) return;
    const current = img.getAttribute('src') || '';
    const master = img.getAttribute('data-master') || '';
    const source = current || master;
    const match = source.match(/(aroma-[a-z0-9-]+)(?:\.webp|\.png)(?:\?.*)?$/i);
    if(!match) return;
    const target = `../${match[1]}.png`;
    if(img.getAttribute('src') !== target) img.setAttribute('src', target);
    img.removeAttribute('data-master');
    img.width = 320;
    img.height = 320;
    img.loading = 'lazy';
    img.decoding = 'async';
  }

  function rewriteAll(root=document){
    root.querySelectorAll?.('.final-aroma-img').forEach(rewriteImage);
  }

  rewriteAll();
  new MutationObserver(mutations => {
    for(const mutation of mutations){
      for(const node of mutation.addedNodes){
        if(node.nodeType !== 1) continue;
        if(node.matches?.('.final-aroma-img')) rewriteImage(node);
        rewriteAll(node);
      }
    }
  }).observe(document.documentElement,{childList:true,subtree:true});
})();
