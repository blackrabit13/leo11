var cheerio = require('cheerio'); // Basically jQuery for node.js
var request = require('request-promise');
var options = {
    uri: 'https://www.ptt.cc/bbs/Beauty/M.1521110977.A.EE0.html',
    transform: function (body) {
        return cheerio.load(body);
    }
};

request(options)
    .then(function ($) {
        // Process html like you would with jQuery...
        console.log($('#main-content a'))
    })
    .catch(function (err) {
        // Crawling failed or Cheerio choked...
    });