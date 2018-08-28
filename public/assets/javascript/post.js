$.ajax({
	url: '/api',
	method: 'GET'
}).then(function(data){

	// next thing to do is create the text as a link to bring up that users information
	// maybe instead of using a <p>, we can use an <a>
	var p, ob, form;
	for(var i = 0; i < data.length; i++) {
		ob = data[i];
		p  = $('<p>');

		p.text(ob.user_name + ' is posting the book with ISBN of ' + 
			ob.ISBN + ' for $' + ob.price);
		$('body').append(p);
	}

});