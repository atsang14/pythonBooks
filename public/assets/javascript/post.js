$.ajax({
	url: '/api',
	method: 'GET'
}).then(function(data){
	// var p, ob, necc, form, button;
	// for (var i=0; i<data.length; i++){
	// 	ob = data[i];
	// 	p = $('<p>');
	// 	p.text(ob.question + ' - ' + ob.category + ' - ' + ob.difficulty);

	// 	form = $('<form>');

	// 	form.attr('action', '/delete/' + ob.id);
	// 	form.attr('method', 'POST');

	// 	button = $('<button>');

	// 	button.text('delete');

	// 	form.append(button);

	// 	p.append(form);

	// 	$('body').append(p);
	// }


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