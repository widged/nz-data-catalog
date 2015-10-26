/* jshint esnext: true */

import React       from 'react';
import ReactDOM    from 'react-dom';
import LazyLoader  from '../wg-lazy-loader/LazyLoader';
import InjectCss   from '../wg-inject-css/InjectCss.es6.js';

let {Component,  PropTypes} = React;
let {findDOMNode} = ReactDOM;

var Normalizer = (function() {
	let knownFormats =
	{
		  'other'   : '-',
			'api' : 'api',
			'webservicexml' : 'api',
			'webservicejson' : 'api',
			'datastream': 'api',
			'othergeo'   : 'geo',
			'htmltable' : 'table',
			'xml' : 'xml',
			'marcandmarcxml' : 'xml',
			'geo' : 'geo',
			'kmlshp' : 'geo',
			'kml' : 'geo',
			'spreadsheet': 'table',
			'csv': 'table',
			'database': 'db',
			'onlinedatabase': 'db',
			'xmlatomrss': 'rss',
			'pdf': 'pdf',
			'html': 'html',
	};

	function normalizeFormats(format) {


		return format.split(/\s*,\s*/).reduce((acc, d) => {
			  let m = d.match(/\[(.*?)\]\((.*?)\)/);
				if(m) { d = m[1]; }
				d = d.toLowerCase();
				d = d.replace(/[^a-z]/g, '');
				d = knownFormats[d] || d;
				if(d !== '-' && acc.indexOf(d) === -1)  { acc.push(d); }
				return acc;
		}, []).join(', ');
	}

	return {normalizeFormats}

} ())


class BookmarkCard extends Component {
// based on http://codepen.io/doonnn/pen/QbBKxv?editors=110

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
		let {title, url, thumbSrc, description, agency, cost, license, format} = d;
		let hasCost = (cost.length && cost !== 'No') ? true : false;

		let licenseIcon = 'fa-question';
		if(license.length && license.match(/creative commons/i)) { licenseIcon = "fa fa-creative-commons"; }
		if(license.length && license.match(/No known New Zealand copyright-related restrictions/i)) { licenseIcon = "fa fa-beer"; }
		if(!licenseIcon) { console.log(license); }

		let formatList = Normalizer.normalizeFormats(format);
		if(!description.length) { description = 'N/A'; }

		let visibleCard = (
			<div className="card">
				<div className="card-img">
					<img src={thumbSrc}></img>
					<div className="card-img-placeholder"></div>
				</div>

				 <div className='card-action'>
					<a href={url} target="blank"><i id="action-btn" className="fa fa-angle-right"></i></a>
				</div>

				 <div className="card-caption">
						<h1>{title}</h1>
						<span className="publisher">{agency}</span>
						<div className="card-description"> {description} </div>
				 </div>

				 <div className="card-tags">
				 	{formatList   ? <div className="tag-wrapper"><i className="format">{formatList}</i> </div> : '' }
				 	{licenseIcon  ? <div className="tag-wrapper"><i className={'license fa ' + licenseIcon}></i></div> : '' }
				 	{hasCost      ? <div className="tag-wrapper"><i className="cost fa fa-usd"></i> </div> : '' }
				 </div>
			 </div>
			 );

			 let notYetVisibleCard = (
	 				<div className="card">
	 					<div className="card-img">
	 						<p>Loading...</p>
	 						<div className="card-img-placeholder"></div>
	 					</div>
							 <div className="card-caption">
									<h1>{title}</h1>
 						 </div>
					 </div>
			 );
		return (
			<wg-bookmark-card>
				<LazyLoader height={300} threshold={100} onVisible={onLazyLoaded}>
					{visible ? visibleCard : notYetVisibleCard }
				</LazyLoader>
			</wg-bookmark-card>
		)
	}
}

/*
			<div className='card-description'>
			<div  dangerouslySetInnerHTML={{__html: description}} ></div>
		</div>

*/

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
