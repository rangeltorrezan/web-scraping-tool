'use strict';

/*
 * Express Dependencies
 */

var express = require('express');
var app = express();
var port = 3000;
var scraping = require('./scraping');
var database = require('./data');

function task() {
    console.log("Start Scrapping Posts " + new Date())
    scraping.start();
    setTimeout(task, 2000000);
}

task();
/*
 * Use Handlebars for templating
 */
var exphbs = require('express3-handlebars');
var hbs;
//var scraping = require('./scraping'); 
// For gzip compression
app.use(express.compress());


// Set Handlebars
app.set('view engine', 'handlebars');



/*
 * Routes
 */
// Index Page
app.get('/',function(req,res){
    res.send('Welcome to CheesCake Labs Scraper');
});

app.get('/posts',function(req,res){
    res.json(database.getPosts()); 
});

/*
 * Start it up
 */
app.listen(process.env.PORT || port);
console.log('Express started on port ' + port);