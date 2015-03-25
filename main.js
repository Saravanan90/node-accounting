var express = require('express'),
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
//app.use(multer());
app.use(express.static(path.join(__dirname, 'www')));

//	Request Handlers
app.get('/', routes.index);
app.post('/addClient', routes.addClient);
app.get('/client', client.getClientDetails);

//	Server Setup
app.listen(app.get('port'), function() {console.log('Server Started & Listening @ ' + app.get('port'))});


	