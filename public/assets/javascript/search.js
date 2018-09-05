var searchUrl = window.location.href;
//http://localhost:3000/searchResults?searchterms=1234567&optradio=on
var queryStr = searchUrl.split("?")[1];
var queryArray = queryStr.split("&");
var searchTerm = queryArray[0].split("=")[1];

console.log(searchTerm);

//https://www.googleapis.com/books/v1/volumes?q=isbn:1285774779

$.ajax({
	url: 'https://www.googleapis.com/books/v1/volumes?q=isbn:' + searchTerm,
	method: 'GET'
}).then(function(data){
    var title = data.items[0].volumeInfo.title;
    // var isbn = data.items[0].volumeInfo.industryIdentifiers[1].identifier;
    var authors = data.items[0].volumeInfo.authors;
    var description = data.items[0].volumeInfo.description;
    var thumbnail = data.items[0].volumeInfo.imageLinks.thumbnail;

    $("#content").append(
        $("<div>").html('<img src="'+thumbnail+'" alt="thumbnail">')
    );
    $("#content").append(
        $("<div>").html('<p class="postTitle">Title: '+title+'</p>')
    );
    $("#content").append(
        $("<div>").html('<p>ISBN: '+searchTerm+'</p>')
    );
    $("#content").append(
        $("<div>").html('<p>Author(s): '+authors+'</p>')
    );
    $("#content").append(
        $("<div>").html('<p>Description: '+description+'</p>')
    );
    var amazonLink = "https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords="+searchTerm;
    $("#amazonLink").attr("href",amazonLink);
	

});
