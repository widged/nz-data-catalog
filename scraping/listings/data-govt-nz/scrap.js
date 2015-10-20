#!/usr/bin/env babel-node

/* jshint esnext: true */

var csv = require("fast-csv");
var fs = require("fs");
import {cleanText} from '../../lib/scrap-helper.js';

var stream = fs.createReadStream("data-govt-nz.csv");

var lines = [];
var csvStream = csv()
    .on("data", function(data){
			lines.push(data.map((d) => {
				return cleanText(d);
		 	}));
    })
    .on("end", function(){
		let body = lines.map((d) => d.join('\t')).join('\n');
    	fs.writeFileSync('links.tsv', body, 'utf8');
    });

stream.pipe(csvStream);
