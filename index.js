var http = require("http");
var https = require("https");
var express = require("express");
var bodyParser = require("body-parser");
var errorHandler = require("errorhandler");
var _ = require("lodash");
var fs = require("fs");

var results = JSON.parse(fs.readFileSync('./results.json', "utf-8"));

var app = express();

app.use(bodyParser.urlencoded({
	extended: true
}));

app.get("/years/:date", function(req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Content-Type");

	var year = req.params.date;

	results.forEach(function(resultYear) {
		if(resultYear.year == year){
			res.json(resultYear.result);	
		}
	});

	res.status(404);
	res.json({'message': 'The corresponding year could not be found'});
	return;
});

app.get("/artists/:name", function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  var name = req.params.name,
    artist = {},
    year = null;

  artist.name = name;
  artist.results = [];

  results.forEach(function(result) {
    year = result.year;
    result.result.forEach(function(val) {
      if (val.artist.toLowerCase() === artist.name) {
        artist.results.push({"year": year, "rank": val.rank});
      }
    });
  });

  if(artist.results.length == 0) {
    res.status(404);
    res.json({'message': 'The corresponding artist: ' + name + ' could not be found'});
    return;
  }

  res.json(artist);
});

app.listen(process.env.PORT || 3000);
