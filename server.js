'use strict';

var express = require('express'),
	logger = require('morgan'),
	bodyParser = require('body-parser'),
	swig = require('swig'),
	sassMiddleware = require('node-sass-middleware');

var app = express();

// views are in the templates folder
app.set('views', __dirname + '/templates');
// the views are html files
app.set('view engine', 'html');
// the html files are rendered using swig's renderer
app.engine('html', swig.renderFile);
// swig should not cache responses
swig.setDefaults({cache: false});

// logging
app.use(logger('dev'));

// parsing payload from incoming requests (available downstream as req.body)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// serve up scss files from the assests folder
// by compiling them and storing those in the public folder
app.use(sassMiddleware({
	src: __dirname + '/assets',
	dest: __dirname + '/public',
	debug: true
}));

// server up files in bower_components folder
app.use('/bower_components', express.static(__dirname + '/bower_components'));

// serve up files from the public folder
app.use(express.static(__dirname + '/public'));

// all other routes
app.use(require('./routes'));

// no route was hit, forward 404 to error handler
app.use(function (req, res, next) {
	var error = new Error('Not Found');
	error.status = 404;
	next(error);
});

// handle all routing errors
app.use(function (err, req, res, next) {
	err.status = err.status || 500;
	res.render('error', {
		error: err
	});
});

var port = 3000;
app.listen(port, function () {
	console.log('Listening patiently on port', port);
});