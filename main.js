var express = require('express'),
	_ = require('underscore'),
	fs = require('fs'),
	routes = require('./routes'),
	client = require('./routes/client'),
	bodyParser = require('body-parser'),
	path = require('path'),
	db = require('./model/db');
	
db.connect('mongodb://localhost/Accounting');
[ routes ].forEach(function(router) {
	router.configure({ model: db });
});
	
var app = express();
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'www')));

//	PreCompile Templates
var templates = {};
var templateFiles = fs.readdirSync( path.join(__dirname, 'views/templates'));
_.each( templateFiles, function(file) {
	var templateString = fs.readFileSync( path.join(__dirname, 'views/templates/') + file, { encoding: 'utf8'});
	templates[file] = templateString;
}); 

//	Request Handlers
app.get('/', routes.index);
app.get('/getLaunchData', routes.getLaunchData.bind(templates));
app.post('/client', routes.addClient);


//	Server Setup
app.listen(app.get('port'), function() {console.log('Server Started & Listening @ ' + app.get('port'))});


	