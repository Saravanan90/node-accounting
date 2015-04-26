var express = require('express'),
	_ = require('underscore'),
	fs = require('fs'),
	routes  = require('./routes'),
	bodyParser = require('body-parser'),
	path = require('path'),
	db = require('./model/db');
//	cons = require('consolidate');
	
db.connect('mongodb://localhost/Accounting');
[ routes ].forEach(function(router) {
	router.configure({ model: db });
});
	
var app = express();
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views/ejs');
app.set('view engine', 'ejs');
/* app.engine('html', cons.underscore);
app.set('view engine', 'html');  */

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'www')));
//app.use(express.static(path.join(__dirname, 'views/html')));

//	PreCompile Templates
var templateFiles = fs.readdirSync( path.join(__dirname, 'views/templates'));
var result = "";
_.each( templateFiles, function(file) {
	var templateString = fs.readFileSync( path.join(__dirname, 'views/templates/') + file, { encoding: 'utf8'}).toString();
	var varName = file + 'TmplObj';
	result += "var "+ varName +"=";
	result += "Backbone.View.extend({\ntemplate: "+_.template(templateString).source+"});\n";
}); 

var scriptFile = fs.readFileSync( path.join(__dirname, 'www/js/index.js'));

var newScript = result + scriptFile;

fs.writeFileSync( path.join(__dirname, 'www/js/newIndex.js'), newScript);  

//	Request Handlers
app.get('/', routes.index);
app.post('/client', routes.addClient);
app.get('/project', routes.getProjects);
app.post('/project', routes.addProject);
app.get('/event', routes.getEvents);
app.post('/event', routes.addEvent);
app.get('/report', routes.getReportData);

//	Server Setup
app.listen(app.get('port'), function() {console.log('Server Started & Listening @ ' + app.get('port'))});	