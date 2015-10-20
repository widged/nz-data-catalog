/* jshint esnext: true */

var sha1 = require('sha1');

var menu = require("../../lib/electron/electron_boilerplate/context_menu.js");

var Datastore = require('nedb'),
		db_default  = new Datastore({ filename: __dirname + '/../data/merged-default/merged.nedb.json', autoload: true });

db_default.find({}, function(err, list) {
	capture(list);
})

function capture(list) {
	var remote = require('' + 'remote');
	var BrowserWindow = remote.require('browser-window');
	var win = new BrowserWindow({ width: 1024, height: 768, show: false });
	win.on('closed', function() {
	  win = null;
	});
	win.show();

	var previews = list.filter((d, i) => { return i > 0 && i <= 3 ; } )
	var count = 0;
	previewUrl(previews.shift());
	function previewUrl({url}) {
		count++;
		if(count % 30 === 0) { console.log(count); }
		win.loadUrl(url);
		screenshot({delay: 3000}, function(png) {
			var filename = sha1(url);
			remote.require('fs').writeFile(`snapshots/raw_${filename}.png`, png, function() {
				if(previews.length) {
					previewUrl(previews.shift());
				} else {
					console.log('[DONE]')
				}
			})
		})
	}

	function screenshot(opt, cb) {
	  cb = cb || function() {}
	  var remote = require('' + 'remote') // prevent static analysis like browserify
	  setTimeout(function() {
	    win.capturePage(function handleCapture(img) {
				cb(img.toPng())
	    });
	  }, opt.delay)
	}
}
