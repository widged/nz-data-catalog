/* jshint esnext: true */

export default class ViewportObserver {
	constructor() {
		this.state    = { viewport: undefined};
		this.dispatch = { change: undefined};
		this.bounded  = { dispatchChange: this.dispatchChange.bind(this) };
	}

	viewport(_) {
		if(!arguments.length) { return this.state.viewport; }
		this.stopListening();
		this.state.viewport = _;
		return this;
	}

	onChange(fn) {
		this.stopListening();
		if (typeof fn !== 'function') { fn = undefined; }
		this.dispatch.change = fn;
		this.startListening();
		return this;
	}

	startListening() {
		let {viewport} = this.state;
		let {dispatchChange} = this.bounded;
		viewport.addEventListener('scroll', dispatchChange);
		window.addEventListener('resize',   dispatchChange);
	}

	stopListening() {
		let {viewport} = this.state;
		let {dispatchChange} = this.bounded;
		if(viewport === undefined || !viewport.removeEventListener) { return; }
    	viewport.removeEventListener('scroll', dispatchChange);
    	window.removeEventListener('resize', dispatchChange);
	}

	dispatchChange() {
		let fn = (this.dispatch || {}).change;
		if(typeof fn === 'function') { fn(); }
	}

	isTopVisible(elem, threshold) {
		let viewport = window;
		const bounds     = elem.getBoundingClientRect();
		const scrollTop = viewport.pageYOffset;
		const top       = bounds.top + scrollTop;
		if(top === 0) {
			return true;
		} else {
			const height    = bounds.bottom - bounds.top;
			return (top <= (scrollTop + viewport.innerHeight + threshold) && (top + height) > (scrollTop - threshold)) ? true : false;
		}
		return false;
	}
}


/*

// http://developer.telerik.com/featured/lazy-loading-images-on-the-web/

function isElementInViewport (el) {

    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */ /*
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */ /*
    );
}

<img data-src="images/Robin.jpg" alt="" />

// https://github.com/remotesynth/Lazy-Loading-Images
// https://rawgit.com/remotesynth/Lazy-Loading-Images/master/custom.html
// http://dinbror.dk/blazy/
// http://www.smashingmagazine.com/2015/02/redefining-lazy-loading-with-lazy-load-xt/

//these handlers will be removed once the images have loaded
window.addEventListener("DOMContentLoaded", lazyLoadImages);
window.addEventListener("load", lazyLoadImages);
window.addEventListener("resize", lazyLoadImages);
window.addEventListener("scroll", lazyLoadImages);

function lazyLoadImages() {
  var images = document.querySelectorAll("#main-wrapper img[data-src]"),
      item;
  // load images that have entered the viewport
  [].forEach.call(images, function (item) {
    if (isElementInViewport(item)) {
      item.setAttribute("src",item.getAttribute("data-src"));
      item.removeAttribute("data-src")
    }
  })
  // if all the images are loaded, stop calling the handler
  if (images.length == 0) {
    window.removeEventListener("DOMContentLoaded", lazyLoadImages);
    window.removeEventListener("load", lazyLoadImages);
    window.removeEventListener("resize", lazyLoadImages);
    window.removeEventListener("scroll", lazyLoadImages);
  }
}

*/
