/* jshint esnext: true */

import React             from 'react';
import ReactDOM          from 'react-dom';
import BookmarksExplorer from './components/wg-bookmarks-explorer/BookmarksExplorer';
import SearchInput       from './components/search-input/SearchInput.react.es6.js';

let {Component,  PropTypes} = React;
let {findDOMNode} = ReactDOM;

// let x = require('https://spreadsheets.google.com/feeds/list/1M-dAy2_oaHugkx8kPYguA_IrYVEKWeejLPCFth506qY/od6/public/values?alt=json-in-script');
// console.log(x);
// view-source:https://spreadsheets.google.com/feeds/list/1M-dAy2_oaHugkx8kPYguA_IrYVEKWeejLPCFth506qY/od6/public/values?alt=json-in-script

export default function main() {

	let dataList = require('../dist/data/merged.js');
	var list = dataList.split(/\n/).map((d) => {
		d = d.replace(/\\/g,'\\\\');
		d = d.replace(/<a href="(.*?)">/g, "<a href='$1'>");
		let {url,sha1, sources, props} = JSON.parse(d);
		let searchText = 'title,description,tags'.split(',').reduce((acc, key) => {
			let arr = props[key];
			return acc + ' ' + (arr || []).join(' ');
		}, '');
		let title = props.title[0];
		let thumbSrc = '../dist/assets/url_thumbs/tn_'+sha1+'.jpg';
		return {title, url, thumbSrc,searchText};
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
				<aside>
					<SearchInput onChange={onDebounceSearchChange} />
				</aside>
				<main>
					<BookmarksExplorer list={list}/>
				</main>
			</wg-app>),
			document.getElementById('app')
		);
	}


	}
