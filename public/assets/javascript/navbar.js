var url = window.location.href;
//http://localhost:3000/searchResults?searchterms=1234567&optradio=on
console.log("url");
console.log(url);
var urlSplit = url.split("/");
// ["http:", "", "localhost:3000", ""]
// ["http:", "", "localhost:3000", "sell"]
console.log("urlSplit");
console.log(urlSplit);
//current location can be found at index 3 of urlSplit
$(".nav-item").removeClass("active");
if (urlSplit[3]==""){
    $("#navHome").addClass("active");
} else if (urlSplit[3]=="sell"){
    $("#navSell").addClass("active");
} else if (urlSplit[3]=="loginPage"){
    $("#navLogStatus").addClass("active");
} else if (urlSplit[3]=="registerPage"){
    $("#navRegister").addClass("active");
}