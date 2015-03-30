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
    setTimeout(task, 200000);
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

/*
 * Config for Production and Development
 */
if (process.env.NODE_ENV === 'production') {
    // Set the default layout and locate layouts and partials
    app.engine('handlebars', exphbs({
        defaultLayout: 'main',
        layoutsDir: 'dist/views/layouts/',
        partialsDir: 'dist/views/partials/'
    }));

    // Locate the views
    app.set('views', __dirname + '/dist/views');
    
    // Locate the assets
    app.use(express.static(__dirname + '/dist/assets'));

} else {
    app.engine('handlebars', exphbs({
        // Default Layout and locate layouts and partials
        defaultLayout: 'main',
        layoutsDir: 'views/layouts/',
        partialsDir: 'views/partials/'
    }));

    // Locate the views
    app.set('views', __dirname + '/views');
    
    // Locate the assets
    app.use(express.static(__dirname + '/assets'));
}

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