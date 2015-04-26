exports.configure = function(params) {
	model = params.model
}
exports.index = function(req, res) {
	model.getClients( function(err, clientList){
		if(!err){
			res.render('index', {
				clients: clientList
			});
		}else{
			res.render('error');
		}
	});
	//res.sendFile('index.html');
}
exports.addClient = function(req, res) {
	var newClient = {
		name: req.body.name,
		eMail: req.body.eMail,
		info: req.body.info
	};
	model.addClient( newClient, function(err, data) {
		if(err){
			res.status(200).send(err);
		}else{
			res.status(200).send(data);
		}
	});
}
exports.getProjects = function(req, res) {
	var clientName = req.query.clientName;
	model.getProjects( clientName, function(err, projList){
		if(!err){
			res.send(projList);
		}
	});
} 
exports.addProject = function(req, res) {
	var newProj = {
		name: req.body.name,
		cost: req.body.cost,
		client: req.body.client
	};
	model.addProject( newProj, function(err, data) {
		if(err){
			res.status(200).send(err);
		}else{
			res.status(200).send(data);
		}
	});
}
exports.getEvents = function(req, res) {
	var projName = req.query.projName;
	model.getActivities( projName, function(err, eventList){
		if(!err){
			res.send(eventList);
		}
	});
} 
exports.addEvent = function(req, res) {
	var newEvent = {
		name: req.body.name,
		time: req.body.time,
		project: req.body.project
	};
	model.addActivity( newEvent, function(err, data) {
		if(err){
			res.status(200).send(err);
		}else{
			res.status(200).send(data);
		}
	});
}
exports.getReportData = function(req, res) {
	model.getReportData( function(err, report){
		if(!err){
			res.send(report);
		}
	});
} 