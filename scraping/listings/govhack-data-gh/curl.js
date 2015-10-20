#!/usr/bin/env babel-node

var fs = require("fs");
var request = require('request');

request('https://github.com/GovHackNZ/govhacknz-data/wiki/List-of-potential-data-sources', function (error, response, body) {
  if (!error && response.statusCode == 200) {
  	fs.writeFileSync('govhack-data-wiki.md', body, 'utf8');
  }
});
