$(document).on("click", "#scrape", function() {
    $.ajax({
        method: "GET",
        url: "/scrape"
    }).done(function(data) {
        console.log(data);
    });
});


$(document).on("click", "#all-articles", function() {
    $.getJSON("/articles", function(data) {
        console.log(data);
        //$("#articles").append(data);
        $("#articles").empty();
        for (var i = 0; i < data.length; i++) {
            var titleDiv = $("<div>");
            titleDiv.addClass("col-xs-12 col-sm-6 col-md-4");
            var titleLink = $("<a>");
            titleLink.attr("href", data[i].link);
            titleLink.text(data[i].title);
            var savedBtn = $("<button>")
            savedBtn.attr("id", "save-article");
            savedBtn.attr("data-id", data[i]._id)
            savedBtn.text("Save Article");
            titleDiv.append(titleLink, data[i].summary, savedBtn);

            $("#articles").append(titleDiv);
        };
    });
});


$(document).on("click", "#save-article", function() {
    var thisId = $(this).attr("data-id");
    console.log(thisId);

    $.ajax({
        method: "GET",
        url: "/articles/saved/" + thisId
    });
});


$(document).on("click", "#saved", function() {
    event.preventDefault();
    $.getJSON("/articles/saved", function(data) {
        console.log(data);
        $("#articles").empty();
        for (var i = 0; i < data.length; i++) {
            var savedDiv = $("<div>");
            savedDiv.addClass("col-xs-12 col-sm-6 col-md-4");
            var savedLink = $("<a>");
            savedLink.attr("href", data[i].link);
            savedLink.text(data[i].title);
            var noteBtn = $("<button>")
            noteBtn.attr("id", "save-note");
            noteBtn.attr("data-id", data[i]._id)
            noteBtn.attr("data-toggle", "modal");
            noteBtn.attr("data-target", "#myModal");
            noteBtn.text("Add Note");
            savedDiv.append(savedLink, data[i].summary, noteBtn);
            $("#articles-saved").append(savedDiv);
        };
    });
});


$(document).on("click", "#save-note", function() {
	event.preventDefault();
    var thisId = $("#save-note").attr("data-id");
    console.log("outside", thisId);
    saveNote(thisId);
});


function saveNote(id) {
	$(document).on("click", "#submit-note", function() {
		event.preventDefault();
	    var note = $("#note").val().trim();
	    console.log(note);
	    console.log("noteid", id);

	    $.ajax({
	    	method: "POST",
	    	url: "/articles/notes/" + id,
	    	data: note
	    }).done(function(data) {
	    	console.log(data);
	    	$("#note").empty();
	    });
	});
}

