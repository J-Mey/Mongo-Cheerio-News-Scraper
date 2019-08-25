var express = require("express");
var logger = require("morgan")
var mongoose = require("mongoose");

// Scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

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
//mongoose.connect("mongodb://localhost/news-scraper", { useNewUrlParser: true });

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/news-scraper";

mongoose.connect(MONGODB_URI);


// Routes
app.get("/", function(req, res) {
    res.send("No articles scraped!")
})

// Route for scraping the nytimes website
app.get("/scrape", function(req, res){
    axios.get("http://www.nytimes.com/section/sports").then(function(response){
        var $ =  cheerio.load(response.data);
        $("article").each(function(i, element){
            // Saving an empty results object
            var result = {};

            // Adding the text and href of every link and save them as properties of the result object
            result.headline = $(this).find("h2").text();
            result.summary = $(this).find("p").text();
            result.url = $(this).find("a").attr("href");

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

// Route for grabbing a specific article by id and populating with it's note
app.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
        res.json(dbArticle)
    })
    .catch(function(err) {
        res.json(err)
    });
});

// Route for saving/updating an article's note
app.post("/articles/:id", function(req, res){
    db.Note.create(req.body)
    .then(function(dbNote){
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err)
    });
});

// Route for saved pages

// Route for saving articles to database

// delete articles from database
app.get("/clear", function(req, res){
    db.Article.deleteMany({}, function (err, res){
        if (err) {
            console.log(err)
        } else {
            console.log(res)
        }
    })
})

// Start the server
app.listen(PORT, function(){
    console.log("App is running on port " + PORT + "!");
});
