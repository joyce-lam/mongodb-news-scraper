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

// Import routes and give the server access to them.
require("./routes/routes.js")(app);

//database configuration with Mongoose
//define local mongodb uri
var databaseUri = "mongodb://localhost/news";

if (process.env.MONGODB_URI) {
	mongoose.connect(process.env.MONGODB_URI);
} else {
	mongoose.connect(databaseUri);
}

var db = mongoose.connection;

db.on("error", function(error) {
	console.log("Mongoose error: ", error)
});

db.once("open", function() {
	console.log("Mongoose connection successful");
})

mongoose.Promise = Promise;


//start the server
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});