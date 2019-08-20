var express = require("express");
var logger = require("morgan")
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");

// Scraping tools
var cheerio = require("cheerio");
var axios = require("axios");

// Require all models
var db = require("./models");

var PORT = 3000;

// Starts Express
var app = express()

// Use morgan logger for logging request
app.use(logger("dev"));

// Parse request body as JSON
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));

// Connection to Mongo DB
mongoose.connect("mongodb://localhost/news-scraper", { useNewUrlParser: true });

// Routes
app.get("/", function(req, res) {
    res.send("No articles scraped!")
})

// Route for scraping the nytimes website
app.get("/scrape", function(req, res){
    axios.get("http://www.nytimes.com/").then(function(response){
        var $ =  cheerio.load(response.data);

        $(".css-6p6lnl h2").each(function(i, element){
            // Saving an empty results object
            var result = {};

            // Adding the text and href of every link and save them as properties of the result object
            result.headline = $(this)
                .children("a")
                .text();
            result.url = $(this)
                .children("a")
                .attr("href");

            // Creating a new article using the result object from scraping
            db.Article.create(result)
                .then(function(dbArticle){
                    console.log(dbArticle)
                })
                .catch(function(err){
                    console.log(err);
                });      
        });

        res.send("Scrape Complete!")
        
    });
});

// Route for getting all articles from the db
app.get("/articles", function(req, res) {
    db.Article.find({})
    .then(function(dbArticle){
        res.json(dbArticle);
    })
    .catch(function(err){
        res.json(err);
    });
});

// Start the server
app.listen(PORT, function(){
    console.log("App is running on port " + PORT + "!");
});
