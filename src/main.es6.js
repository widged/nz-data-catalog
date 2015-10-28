/* jshint esnext: true */

import React             from 'react';
import ReactDOM          from 'react-dom';
import BookmarksExplorer from './components/wg-bookmarks-explorer/BookmarksExplorer';
import SearchInput       from './components/wg-search-input/SearchInput.react.es6.js';

let {Component,  PropTypes} = React;
let {findDOMNode} = ReactDOM;

// let x = require('https://spreadsheets.google.com/feeds/list/1M-dAy2_oaHugkx8kPYguA_IrYVEKWeejLPCFth506qY/od6/public/values?alt=json-in-script');
// console.log(x);
// view-source:https://spreadsheets.google.com/feeds/list/1M-dAy2_oaHugkx8kPYguA_IrYVEKWeejLPCFth506qY/od6/public/values?alt=json-in-script
// https://docs.google.com/spreadsheet/pub?key=1M-dAy2_oaHugkx8kPYguA_IrYVEKWeejLPCFth506qY&single=true&gid=0&output=csv


export default function main() {

	function getLongestValue(v) {
		if(!Array.isArray(v)) { return ''; }
		return v.reduce((acc,d) => {
			if(d && d.length > acc.length) { acc = d; }
			return acc;
		}, '');

	}

	let dataList = require('../dist/data/merged.js');
	var list = dataList.split(/\n/).map((d) => {
		d = d.replace(/\\/g,'\\\\');
		d = d.replace(/<a href="(.*?)">/g, "<a href='$1'>");
		let {url,sha1, sources, props} = JSON.parse(d);
		let searchText = 'title,description,agency,tags'.split(',').reduce((acc, key) => {
			let arr = props[key];
			return acc + ' ' + (arr || []).join(' ');
		}, '');
		let title   = getLongestValue(props.title);
		let description   = getLongestValue(props.description);
		let agency  = getLongestValue(props.agency);
		let cost    = getLongestValue(props.cost);
		let license = getLongestValue(props.license);
		let format  = getLongestValue(props.format);
		let thumbSrc = props.thumbnail && props.thumbnail.length ? props.thumbnail : '../dist/assets/url_thumbs/tn_'+sha1+'.jpg';
		return {title, url, thumbSrc,searchText, description, agency, cost, license, format};
	});

	function debounce(fn, delay) {
	  var timer = null;
	  return function () {
	    var context = this, args = arguments;
	    clearTimeout(timer);
	    timer = setTimeout(function () {
	      fn.apply(context, args);
	    }, delay);
	  };
	}

	function hasSearchText(text) {
		return function(d) {
			return d.searchText.match(new RegExp(text, 'i'));
		};
	}

	function onSearchChange(text) {
		let items = list.filter(hasSearchText(text))
		render(items);
	}

	let onDebounceSearchChange = debounce(onSearchChange, 200);
	onSearchChange();

	function render(list) {
		ReactDOM.render(
			(<wg-app>
				<header>
					<div className='header-text'>
						<h1>New Zealand Data Catalog</h1>
						<h2>A compilation of various lists of links of reusable NZ datasets</h2>
					</div>
					<div className='header-band'></div>
				</header>
				<main>
					<aside>
						<SearchInput onChange={onDebounceSearchChange} />
						<div className="about">
							<p>Many geospatial datasets are not included. Use <a href="data.govt.nz">data.govt.nz</a> to search for them.</p>
					    <p><a href="http://widged.github.io/nz-data-catalog/" target="blank">About</a></p>
						</div>
					</aside>
					<section><div className='wrapper'>
							<BookmarksExplorer list={list}/>
					</div></section>
				</main>
			</wg-app>),
			document.getElementById('app')
		);
	}


	}
