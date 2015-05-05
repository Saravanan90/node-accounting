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

//	Request Handlers
app.get('/Accounting(/clients)?', routes.index);
app.get('/Accounting/:clientName/projects', routes.indexGetClientDetails);
app.get('/Accounting/:projName/events', routes.indexGetProjDetails);
app.get('/Accounting/report', routes.indexGetReportDetails);
app.post('/client', routes.addClient);
app.get('/project', routes.getProjectsByClient);
app.post('/project', routes.addProject);
app.get('/event', routes.getEvents);
app.post('/event', routes.addEvent);
app.get('/report', routes.getReportData);
app.get('*', routes.redirect);

//	Server Setup
app.listen(app.get('port'), function() {console.log('Server Started & Listening @ ' + app.get('port'))});	