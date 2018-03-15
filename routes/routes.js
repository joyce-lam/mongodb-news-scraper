var cheerio = require("cheerio");
var request = request("request");

module.exports = function(app) {

	app.get("/", function(req, res) {
	    res.render("home");
	});


	app.get("/all", function(req, res) {
		db.
		res.render("home", )

	});

	app.get("/api/scrape", function(req, res) {


	});

	app.get("/recipes/:id", function(req, res) {


	});

	app.post("/recipes/:id/post", function(req, res) {


	});


	app.get("*", function(req, res) {


	});

}