function closestParent(elem, selector) {
    var firstChar = selector.charAt(0);
    let checkFn;
    if ( firstChar === '.' ) { // selector is a classname
      checkFn = function(elem) { return elem.classList.contains( selector.substr(1) ); }
    } else if ( firstChar === '#' ) { // selector is an ID
      checkFn = function(elem) { return elem.id === selector.substr(1); }
    } else if ( firstChar === '[' ) { // selector is a data attribute
      checkFn = function(elem) { return elem.hasAttribute( selector.substr(1, selector.length - 2) ); };
    } else { // selector is a tag
      checkFn = function(elem) { return elem.tagName.toLowerCase() === selector; };
    }
    for ( ; elem && elem !== document; elem = elem.parentNode ) {
      if(checkFn(elem)) { return elem; }
    }
    return;
};

export {closestParent};