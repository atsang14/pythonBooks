var searchTerm = $("#searchTerm").attr("searchTerm");

console.log(searchTerm);

// $("#postings").css("display","none");
// $("#amazon").css("display","none");

//https://www.googleapis.com/books/v1/volumes?q=intitle:flat%20pack

$.ajax({
	url: 'https://www.googleapis.com/books/v1/volumes?q=intitle:' + searchTerm,
	method: 'GET'
}).then(function(data){
    if (data.totalItems==0){
        $("#content").append(
            $("<div>").html('<h1>Title = '+searchTerm+' returned no results. Please try again.</h1>')
        );
    } else {
        var searchResults = data.items; //this is an array of search results
        var title, authors, description, thumbnail, isbn, newDiv, isbnParagraph;

        for (i in searchResults){
            
            //look for isbn_10
            for (j in searchResults[i].volumeInfo.industryIdentifiers){
                if (searchResults[i].volumeInfo.industryIdentifiers[j].type=="ISBN_10"){
                    isbn = searchResults[i].volumeInfo.industryIdentifiers[0].identifier;
                    break;
                }
            }
            //if isbn_10 does not exist, do not add result to screen
            if (isbn){
                title = searchResults[i].volumeInfo.title;
                //google book api gives back inconsistent data, have to check existence of each key before retrieving its value
                if (searchResults[i].volumeInfo.hasOwnProperty("authors")){
                    authors = searchResults[i].volumeInfo.authors;
                } else {
                    authors = ["N/A"];
                }
                if (searchResults[i].volumeInfo.hasOwnProperty("description")){
                    description = searchResults[i].volumeInfo.description;
                } else {
                    description = "No book description available."
                }
                if (searchResults[i].volumeInfo.hasOwnProperty("imageLinks")){
                    thumbnail = searchResults[i].volumeInfo.imageLinks.thumbnail;
                } else {
                    thumbnail = "/assets/images/noBookIMG.png";
                }
                if (searchResults[i].volumeInfo.industryIdentifiers[0].type=="ISBN_10"){
                    isbn = searchResults[i].volumeInfo.industryIdentifiers[0].identifier;
                } else if (searchResults[i].volumeInfo.industryIdentifiers[1].type=="ISBN_10") {
                    isbn = searchResults[i].volumeInfo.industryIdentifiers[1].identifier;
                }
                if (isNaN(isbn)){
                    //isbn is not a number, cannot be searched w/ our system, cannot provide link to search results since search will break
                    isbnParagraph = '<p>ISBN: '+isbn+'</p>';
                } else {
                    //isbn is a number, can be searched w/ our system, can continue to search results page
                    isbnParagraph = '<p><a href="/searchResults?searchterms='+isbn+'">ISBN: '+isbn+'</a> <<< Click ISBN for search results</p>'
                }
                newDiv = $("<div>").attr("id","searchResult"+i);
                newDiv.append(
                    $("<hr>")
                ).append(
                    $("<div>").addClass("row padTop20").append(
                        $("<div>").attr("id","picDiv").addClass("col-sm-3").html('<img src="'+thumbnail+'" alt="thumbnail"'+i+'>')
                    ).append(
                        $("<div>").attr("id","infoDiv").addClass("col-sm-9").html('<p class="postTitle">Title: '+title+'</p>'+isbnParagraph+'<p>Author(s): '+authors+'</p>')
                    )   
                ).append(
                    $("<div>").attr("id","descriptDiv").html('<p>Description: '+description+'</p>')
                );
                $("#content").append(newDiv);
                
            }
            


            
        }
        
    }
});
