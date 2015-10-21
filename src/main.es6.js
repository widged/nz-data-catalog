/* jshint esnext: true */

import React             from 'react';
import ReactDOM          from 'react-dom';
import BookmarksExplorer from './components/wg-bookmarks-explorer/BookmarksExplorer';
import SearchInput       from './components/search-input/SearchInput.react.es6.js';


let {Component,  PropTypes} = React;
let {findDOMNode} = ReactDOM;




export default function main() {

	let dataList = require('../dist/data/merged.js');
	var list = dataList.split(/\n/).map((d) => {
		d = d.replace(/\\/g,'\\\\');
		d = d.replace(/<a href="(.*?)">/g, "<a href='().*?)'>");
		let {url,sha1, listed} = JSON.parse(d);
		let searchText = listed.map(function(d) {
			return [d.title || '', d.description || '', d.tags || ''].join(' ');
		}).join(' ')
		let title = listed[0].title;
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
