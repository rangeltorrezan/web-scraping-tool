var CronJob = require('cron').CronJob,
    request = require('request'),
    cheerio = require('cheerio'),
    orm = require("orm"),
    dataPosts = [],
    posts = [],
    dbPost;

module.exports = {
  start: function () {
    orm.connect("mysql://root:ckl011001@cklabs.cogshfmhzdz4.sa-east-1.rds.amazonaws.com/cklab", function (err, db) {

        dbPost = db.define("posts", {
            title : String,
            content: String,
            author: String,
            authorTwitter: String,
            authorProfile: String,
            datePublish: String,
        });

    });

    console.log("Start Scraping Tool");

    //Schedule task to get list and posts from techcrunch
    urlPosts = 'http://techcrunch.com/';

    request(urlPosts, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);
            var newsPosts;
  
            $('.post-title a').filter(function(){
                var data = $(this);
                newsPosts = data.attr('href');
                posts.push(newsPosts);
            })
        }
    })

    for (post in posts) {
        var url = posts[post];
        request(url, function(error, response, html){
            if(!error){
                var $ = cheerio.load(html);

                var title, conteudo, author;
                var json = { title : "", post_content : "", author : ""};
     
                $('h1').filter(function(){
                    var data = $(this);
                    title = data.text().trim().replace(/\s\s+/g, ',');
                    json.title = title;
                })

                $('.article-entry p').filter(function(){
                    var data = $(this);
                    conteudo = data.text().trim().replace(/\s\s+/g, ',');
                    json.post_content = conteudo;
                })

                $('.byline > a').filter(function(){
                    var data = $(this);
                    author = data.text().trim().replace(/\s\s+/g, ',');
                    json.author = author;
                })
                $('.twitter-handle a').filter(function(){
                    var data = $(this);
                    authorTwitter = data.attr('href');
                    json.authorTwitter = authorTwitter;
                })

                $('.byline > a').filter(function(){
                    var data = $(this);
                    authorProfile = data.attr('href');
                    json.authorProfile = authorProfile;
                })

                $('.title-left time.timestamp').filter(function(){
                    var data = $(this);
                    datePublish = data.text().trim().replace(/\s\s+/g, ',');
                    json.datePublish = datePublish;
                })

                
            }
            dataPosts.push(json);
            var newRecord = {};
            newRecord.title = json.title;
            newRecord.content = json.post_content;
            newRecord.author = json.author;
            newRecord.authorTwitter = json.authorTwitter;
            newRecord.authorProfile =  json.authorProfile;
            newRecord.datePublish = json.datePublish;
            dbPost.create(newRecord, function(err, results) {
            });
        })
    }   
  return "Scrapping ...";
  }
};
