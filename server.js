//dependencies
var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
var logger = require("morgan");
var cheerio = require("cheerio");
var mongoose = require("mongoose");


//initialize express
var app = express();

//set PORT from env or use 3000
var PORT = process.env.PORT || 3000;

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

//user morgan logger for logging requests
app.use(logger("dev"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Set Handlebars.
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// // Import routes and give the server access to them.
require("./routes/routes.js")(app);
var db = require("./models");

//connect to MongoDB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/news", {
    useMongoClient: true
});


// //routes
// app.get("/", function(req, res) {
//     res.render("index");
// });

// app.get("/scrape", function(req, res) {
//     // Making a request for New York Times homepage
//     request("https://www.nytimes.com/?mcubz=3&WT.z_jog=1&hF=f&vS=undefined", function(error, response, html) {
//         // Load the body of the HTML into cheerio
//         var $ = cheerio.load(html);
//         // Empty array to save our scraped data

//         var results = [];
//         $("article.story.theme-summary").each(function(i, element) {
//             var result = {};
//             result.title = $(element).children("h2.story-heading").text();
//             result.link = $(element).children("h2.story-heading").children("a").attr("href");
//             result.summary = $(element).children("p.summary").text();

//             if (result.title && result.link && result.summary) {
//                 console.log(result);
//                 db.Article.create(result)
//                     .then(function(dbArticle) {

//                         //console.log(dbArticle);
//                         res.send("complete");
//                         //res.redirect("/")
//                     }).catch(function(err) {
//                         res.json(err);
//                     });
//             }
//         });
//     });
// });


// app.get("/articles", function(req, res) {
//     db.Article.find({})
//         .then(function(dbArticle) {
//             console.log("articles", dbArticle);
//             //res.render("home", )
//             res.json(dbArticle);
//             // res.render("index", burger);
//         }).catch(function(err) {
//             res.json(err);
//         });
// });


// app.get("/articles/saved/:id", function(req, res) {
//     db.Article.findOneAndUpdate({
// 	        _id: req.params.id
// 	    }, {
// 	        saved: true
// 	    }, {
// 	        new: true
// 	    },
// 	    function(err, edited) {
// 	        if (err) {
// 	            console.log(err);
// 	            res.send(error);
// 	        } else {
// 	            console.log(edited);
// 	        }
// 	    });
// });


// app.get("/articles/saved", function(req, res) {
// 	db.Article.find({
// 		saved: true
// 	}).then(function(dbArticle) {
// 		console.log("saved", dbArticle);
// 		res.json(dbArticle);
// 	}).catch(function(err) {
// 		res.json(err);
// 	});
// });


// app.post("/articles/note/:id", function(req, res) {
// 	console.log("req", req.body);
// 	db.Note.create(req.body)
// 	.then(function(dbNote) {
// 		return db.Article.findOneAndUpdate({_id: req.params.id}, {$push: {
// 			notes: dbNote._id
// 		}}, {new: true});
// 	}).then(function(dbArticle) {
// 		res.json(dbArticle);
// 	}).catch(function(err) {
// 		res.json(err);
// 	});
// });


// app.get("/articles/note/:id", function(req, res) {
// 	db.Article.findOne({
// 		_id: req.params.id
// 	}).populate("notes")
// 	.then(function(dbArticle) {
// 		//console.log(dbArticle);
// 		res.json(dbArticle);
// 	}).catch(function(err) {
// 		res.json(err);
// 	});
// });

// app.delete("/articles/note/:id", function(req, res) {
// 	console.log("delete req", req.params.id);
// 	db.Note.findByIdAndRemove({
// 		_id: req.params.id
// 	}).then(function(dbNote) {
// 		res.json(dbNote);
// 	}).catch(function(err) {
// 		res.json(err);
// 	});
// });


//start the server
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});