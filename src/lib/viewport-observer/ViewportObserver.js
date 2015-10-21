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