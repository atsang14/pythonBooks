var isbn = $("#isbn").attr("isbn");

//https://www.googleapis.com/books/v1/volumes?q=isbn:1285774779

$.ajax({
	url: 'https://www.googleapis.com/books/v1/volumes?q=isbn:' + isbn,
	method: 'GET'
}).then(function(data){
    var title = data.items[0].volumeInfo.title;
    // var isbn = data.items[0].volumeInfo.industryIdentifiers[1].identifier;
    var authors = data.items[0].volumeInfo.authors;
    var description = data.items[0].volumeInfo.description;
    var thumbnail = data.items[0].volumeInfo.imageLinks.thumbnail;

    $("#ajaxData").append(
        $("<div>").html('<img src="'+thumbnail+'" alt="thumbnail">')
    );
    $("#ajaxData").append(
        $("<div>").html('<p class="postTitle">Title: '+title+'</p>')
    );
    
});
