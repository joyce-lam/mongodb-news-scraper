//dependencies
var request = require("request");
var logger = require("morgan");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var db = require("../models");

module.exports = function(app) {
	//routes
	//home route
	app.get("/", function(req, res) {
	    res.render("index");
	});

	//route to scrape
	app.get("/scrape", function(req, res) {
	    // Making a request for New York Times homepage
	    request("https://www.nytimes.com/?mcubz=3&WT.z_jog=1&hF=f&vS=undefined", function(error, response, html) {
	        // Load the body of the HTML into cheerio
	        var $ = cheerio.load(html);
	        
	        $("article.story.theme-summary").each(function(i, element) {
	            var result = {};
	            result.title = $(element).children("h2.story-heading").text();
	            result.link = $(element).children("h2.story-heading").children("a").attr("href");
	            result.summary = $(element).children("p.summary").text();

	            if (result.title && result.link && result.summary) {
	                console.log(result);
	                db.Article.create(result)
	                    .then(function(dbArticle) {
	                    	console.log("db", dbArticle);
	                        res.redirect("/");
	                    }).catch(function(err) {
	                        if (err.code === 11000) {
	                        	res.redirect("/error");
	                        }
	                    });
	            }
	        });
	    });
	});

	//route for error when there is no new article
	app.get("/error", function(req, res) {
		res.render("err");
	})

	//route to get all articles
	app.get("/articles", function(req, res) {
	    db.Article.find({})
	        .then(function(dbArticle) {
	            res.render("index", {articles: dbArticle});
	        }).catch(function(err) {
	            res.json(err);
	        });
	});

	//route to update article to 'saved'
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

	//route to get all saved articles
	app.get("/articles/saved", function(req, res) {
		db.Article.find({
			saved: true
		}).then(function(dbArticle) {
			res.render("saved", {articles: dbArticle});
		}).catch(function(err) {
			res.json(err);
		});
	});

	//route to add note
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

	//route to get all notes of a particular article
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

	//route to delete note
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