/* jshint esnext: true */

import React       from 'react';
import ReactDOM    from 'react-dom';
import LazyLoader  from '../wg-lazy-loader/LazyLoader';
import InjectCss   from '../wg-inject-css/InjectCss.es6.js';

let {Component,  PropTypes} = React;
let {findDOMNode} = ReactDOM;

class BookmarkCard extends Component {

	constructor(props) {
		super(props);
		this.state   = {visible: false}
		this.bounded = {
			onLazyLoaded: this.onLazyLoaded.bind(this)
		};
	}
	onLazyLoaded() {
		if(!this.state.visible) {
			this.setState({visible: true});
		}
	}

	render() {
		const {d, i}       = this.props;
		const {visible}    = this.state;
		let {onLazyLoaded} = this.bounded;
		let {title, url, thumbSrc, agency, cost, license} = d;
		let hasCost = (cost.length && cost !== 'No') ? true : false;

		let licenseIcon = 'fa-question';
		if(license.length && license.match(/creative commons/i)) { licenseIcon = "fa fa-creative-commons"; }
		if(license.length && license.match(/No known New Zealand copyright-related restrictions/i)) { licenseIcon = "fa fa-beer"; }
		if(!licenseIcon) { console.log(license); }

		// <a href={url}><svg width="16" height="16" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1408 928v320q0 119-84.5 203.5t-203.5 84.5h-832q-119 0-203.5-84.5t-84.5-203.5v-832q0-119 84.5-203.5t203.5-84.5h704q14 0 23 9t9 23v64q0 14-9 23t-23 9h-704q-66 0-113 47t-47 113v832q0 66 47 113t113 47h832q66 0 113-47t47-113v-320q0-14 9-23t23-9h64q14 0 23 9t9 23zm384-864v512q0 26-19 45t-45 19-45-19l-176-176-652 652q-10 10-23 10t-23-10l-114-114q-10-10-10-23t10-23l652-652-176-176q-19-19-19-45t19-45 45-19h512q26 0 45 19t19 45z"/></svg></a>
		// based on http://codepen.io/doonnn/pen/QbBKxv?editors=110
		return (
			<wg-bookmark-card>
				<LazyLoader height={200} threshold={100} onVisible={onLazyLoaded}>
					<div className="card">
						 <div className="card-img">
							 {visible ? <img src={thumbSrc}></img> : ''}
							 <div className="card-img-placeholder"></div>
						 </div>
						 <div className="card-caption">
							  <div className='card-action'>
								 <a href={url} target="blank"><i id="action-btn" className="fa fa-angle-right"></i></a>
							 </div>
							 <div className="card-caption-inner">
								 <h1>{title}</h1>
								 <span className="date">{agency}</span>
							 </div>
						 </div>
						 <div className="card-tags">
							 {licenseIcon    ? <div className="tag-wrapper"><i className={'license fa ' + licenseIcon}></i> <em>license</em></div> : '' }
							 {hasCost    ? <div className="tag-wrapper"><i className="cost fa fa-usd"></i> <em>cost</em></div> : '' }
						 </div>
					 </div>
				</LazyLoader>
			</wg-bookmark-card>
		)
	}
}

export default class BookmarksExplorer extends Component {

	render() {
		let {list} = this.props;
		return (
			<wg-data-catalog  class='lazyload-viewport'>
				<div>
					<ul>{list.map((d, i) => {return <li key={'i_'+i}><BookmarkCard d={d}  i={i} /></li>;})}</ul>
				</div>
			</wg-data-catalog>
	);
	}
}
