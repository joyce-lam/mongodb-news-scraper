//dependencies
var request = require("request");
var logger = require("morgan");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var db = require("../models");

module.exports = function(app) {
	//routes
	app.get("/", function(req, res) {
	    res.render("index");
	});

	app.get("/scrape", function(req, res) {
	    // Making a request for New York Times homepage
	    request("https://www.nytimes.com/?mcubz=3&WT.z_jog=1&hF=f&vS=undefined", function(error, response, html) {
	        // Load the body of the HTML into cheerio
	        var $ = cheerio.load(html);
	        var results = [];
	        $("article.story.theme-summary").each(function(i, element) {
	            var result = {};
	            result.title = $(element).children("h2.story-heading").text();
	            result.link = $(element).children("h2.story-heading").children("a").attr("href");
	            result.summary = $(element).children("p.summary").text();

	            if (result.title && result.link && result.summary) {
	                console.log(result);
	                db.Article.create(result)
	                    .then(function(dbArticle) {
	                        res.redirect("/");
	                    }).catch(function(err) {
	                        res.json(err);
	                    });
	            }
	        });
	    });
	});


	app.get("/articles", function(req, res) {
	    db.Article.find({})
	        .then(function(dbArticle) {
	            res.render("index", {articles: dbArticle});
	        }).catch(function(err) {
	            res.json(err);
	        });
	});


	app.put("/articles/saved/:id", function(req, res) {
	    db.Article.findOneAndUpdate({
		        _id: req.params.id
		    }, {
		        saved: true
		    }, {
		        new: true
		    },
		    function(err, edited) {
		        if (err) {
		            console.log(err);
		            res.send(error);
		        } else {
		            console.log(edited);
		        }
		    });
	});


	app.get("/articles/saved", function(req, res) {
		db.Article.find({
			saved: true
		}).then(function(dbArticle) {
			res.render("index", {articles: dbArticle});
			// console.log("saved", dbArticle);
			// res.json(dbArticle);
		}).catch(function(err) {
			res.json(err);
		});
	});


	app.post("/articles/note/:id", function(req, res) {
		console.log("req", req.body);
		db.Note.create(req.body)
		.then(function(dbNote) {
			return db.Article.findOneAndUpdate({_id: req.params.id}, {$push: {
				notes: dbNote._id
			}}, {new: true});
		}).then(function(dbArticle) {
			res.json(dbArticle);
		}).catch(function(err) {
			res.json(err);
		});
	});


	app.get("/articles/note/:id", function(req, res) {
		db.Article.findOne({
			_id: req.params.id
		}).populate("notes")
		.then(function(dbArticle) {
			res.json(dbArticle);
		}).catch(function(err) {
			res.json(err);
		});
	});

	app.delete("/articles/note/:id", function(req, res) {
		console.log("delete req", req.params.id);
		db.Note.findByIdAndRemove({
			_id: req.params.id
		}).then(function(dbNote) {
			res.json(dbNote);
		}).catch(function(err) {
			res.json(err);
		});
	});

};