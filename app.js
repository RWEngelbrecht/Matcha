const	express	=	require('express');
		app		=	express();
		// mysql	=	require('mysql');

app.get('/', function (req, res) {
  res.sendfile('matcha/routes/index.js');
});

app.listen(8000, function () {
  console.log('Example app listening on port 8000!');
});
