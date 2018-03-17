//event listener to make a get request at /scrape
$(document).on("click", "#scrape", function() {
    $.ajax({
        method: "GET",
        url: "/scrape"
    }).done(function(data) {
    	console.log(data);
    });
});

//event listener to display articles
$(document).on("click", "#all-articles", function() {
	$.ajax({
		method: "GET",
		url: "/articles"
	}).then(function(data){
		console.log(data);
	});
});

//event listener to save articles
$(document).on("click", "#save-article", function() {
    var thisId = $(this).attr("data-id");
    console.log(thisId);

    $.ajax({
        method: "PUT",
        url: "/articles/saved/" + thisId
    }).then(function(data) {
    	console.log("saved article");
    });
});

//event listener to get all saved articles
$(document).on("click", "#saved", function() {
	$("#new").empty();
	//$("#articles").empty();
	$.ajax({
        method: "GET",
        url: "/articles/saved/"
    }).then(function(data) {
    	console.log("Returned all saved articles");
    });
});

//event listener to add note
$(document).on("click", "#save-note", function() {
	//event.preventDefault();
    var thisId = $(this).attr("data-id");
    console.log("saveid", thisId);
    saveNote(thisId);
});

//function to save note
function saveNote(id) {
	$(document).on("click", "#submit-note", function() {
		//event.preventDefault();
	    $.ajax({
	    	method: "POST",
	    	url: "/articles/note/" + id,
	    	data: {
	    		body: $("#note").val().trim()
	    	}
	    }).done(function(data) {
	    	console.log(data);
	    });
	    $("#note").val("");
	});
}

//event listener to read all notes
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

//event listener to delete notes
$(document).on("click", "#delete-note", function() {
	event.preventDefault();
	var thisId = $("#delete-note").attr("data-id");

	$.ajax({
		method: "DELETE",
		url: "/articles/note/" + thisId
	}).done(function(data) {
		console.log("Deleted Note");
			location.reload();
	});
});
