//dependencies
var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
var cheerio = require("cheerio");
var mongoose = require("mongoose");

//initialize express
var app = express();

//set PORT from env or use 3000
var PORT = process.env.PORT || 3000;

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Set Handlebars.
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// Import routes and give the server access to them.
require("./routes/routes.js")(app);

//
app.listen(PORT, function() {
	console.log("App listening on PORT " + PORT);
});


