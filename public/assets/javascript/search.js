var searchUrl = window.location.href;
//http://localhost:3000/searchResults?searchterms=1234567&optradio=on
var queryStr = searchUrl.split("?")[1];
var queryArray = queryStr.split("&");
var searchTerm = queryArray[0].split("=")[1];

console.log(searchTerm);

$("#postings").css("display","none");
$("#amazon").css("display","none");

//https://www.googleapis.com/books/v1/volumes?q=isbn:1285774779

$.ajax({
	url: 'https://www.googleapis.com/books/v1/volumes?q=isbn:' + searchTerm,
	method: 'GET'
}).then(function(data){
    if (data.totalItems==0){
        $("#content").append(
            $("<div>").html('<h1>ISBN = '+searchTerm+' returned no results. Please check ISBN.</h1>')
        );
        
    } else {
        var title = data.items[0].volumeInfo.title;
        // var isbn = data.items[0].volumeInfo.industryIdentifiers[1].identifier;
        if (data.items[0].volumeInfo.hasOwnProperty("authors")){
            authors = data.items[0].volumeInfo.authors;
        } else {
            authors = ["N/A"];
        }
        if (data.items[0].volumeInfo.hasOwnProperty("description")){
            description = data.items[0].volumeInfo.description;
        } else {
            description = "No book description available."
        }
        if (data.items[0].volumeInfo.hasOwnProperty("imageLinks")){
            thumbnail = data.items[0].volumeInfo.imageLinks.thumbnail;
        } else {
            thumbnail = "/assets/images/noBookIMG.png";
        }
        
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
        
        $("#postings").css("display","block");
        $("#amazon").css("display","block");
    }
});
