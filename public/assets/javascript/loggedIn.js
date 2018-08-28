$.ajax({
	url: '/createLoggout',
	method: 'GET'
}).then(function(data) {
	console.log(data);
	console.log('line 6');
});


