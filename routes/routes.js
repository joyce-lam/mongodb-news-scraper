//dependencies
var request = require("request");
var logger = require("morgan");
var cheerio = require("cheerio");
var db = require("../models");

module.exports = function(app) {
//routes
app.get("/scrape", function(req, res) {
    // Making a request for New York Times homepage
    request("https://www.nytimes.com/?mcubz=3&WT.z_jog=1&hF=f&vS=undefined", function(error, response, html) {
        // Load the body of the HTML into cheerio
        var $ = cheerio.load(html);
        // Empty array to save our scraped data

        var results = [];
        $("article.story.theme-summary").each(function(i, element) {
            var title = $(element).children("h2.story-heading").text();
            var link = $(element).children("h2.story-heading").children("a").attr("href");
            var summary = $(element).children("p.summary").text();

            if (title && link && summary) {
                results.push({
                    articleTitle: title,
                    articleLink: link,
                    articleSummary: summary
                });
            }
        });
        console.log(results);

        var articlesNum = results.length;

        db.Article.create(results)
            .then(function(dbArticle) {
                res.send("Found " + articlesNum + " new articles.")
            }).catch(function(err) {
            	res.json(err);
            });
    });
});




app.get("/", function(req, res) {
    res.render("home");
});


app.get("/articles", function(req, res) {
    db.Article.find({})
    .then(function(dbArticle) {
    	console.log(dbArticle);
    	//res.render("home", )
    }).catch(function(err) {
    	res.json(err);
    });
});


app.get("/articles/:id", function(req, res) {


});

app.post("/articles/:id/post", function(req, res) {


});


app.get("*", function(req, res) {


});
}