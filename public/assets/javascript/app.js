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

            var saveNoteBtn = $("<button>");
            saveNoteBtn.attr({
            	"id": "save-note",
            	"data-id": data[i]._id,
            	"data-toggle": "modal",
            	"data-target": "#myModal"
            })
            saveNoteBtn.text("Add Note");

            var readNoteBtn = $("<button>");
            readNoteBtn.attr({
            	"id": "read-note",
            	"data-id": data[i]._id,
            	"data-toggle": "modal",
            	"data-target": "#myModal"
            })
            readNoteBtn.text("See All Notes");

            savedDiv.append(savedLink, data[i].summary, saveNoteBtn, readNoteBtn);
            $("#articles-saved").append(savedDiv);
        };
    });
});


$(document).on("click", "#save-note", function() {
	event.preventDefault();
    var thisId = $("#save-note").attr("data-id");
    saveNote(thisId);
});


function saveNote(id) {
	$(document).on("click", "#submit-note", function() {
		event.preventDefault();
	    $.ajax({
	    	method: "POST",
	    	url: "/articles/note/" + id,
	    	data: {
	    		body: $("#note").val().trim()
	    	}
	    }).done(function(data) {
	    	console.log(data);
	    	$("#note").empty();
	    });
	    $("#note").val("");
	});
}


$(document).on("click", "#read-note", function() {
	event.preventDefault();
    var thisId = $("#read-note").attr("data-id");
    $(".modal-content").empty();
    $.ajax({
    	method: "GET",
    	url: "/articles/note/" + thisId
    }).done(function(data) {
    	console.log(data);
    	for (var i = 0; i < data.notes.length; i++) {
    		var renderNoteDiv = $("<div>");
    		renderNoteDiv.append("Note " + (i+1) + " " + data.notes[i].body);

    		var deleteNoteBtn = $("<button>");
    		deleteNoteBtn.attr({
    			"id": "delete-note",
    			"data-id": data.notes[i]._id
    		});
    		deleteNoteBtn.text("Delete")

    		$(".modal-content").append(renderNoteDiv, deleteNoteBtn);
    	}
    });
});

$(document).on("click", "#delete-note", function() {
	event.preventDefault();
	var thisId = $("#delete-note").attr("data-id");
	console.log("delete", thisId);

	$.ajax({
		method: "DELETE",
		url: "/articles/note/" + thisId
	}).done(function(data) {
		console.log("Deleted Note");
	});
	console.log("abc");
});
