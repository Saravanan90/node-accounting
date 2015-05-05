exports.configure = function(params) {
	model = params.model
}
var indexRouteCallBack = function( res, err, serverData){
	if(!err){
		res.render('index', {
			data: serverData
		});
	}else{
		res.render('error');
	}
};
exports.index = function(req, res) {
	model.getClients( function(err, clientList){
		var data = {
			clients: clientList
		};
		indexRouteCallBack( res, err, data );
	});
}
exports.indexGetClientDetails = function(req, res) {
	var clientName = req.params.clientName;
	model.getClient( clientName, function(err, client){
		if(!err){
			var data = {
				client: client[0]
			};
			getProjectsByClient(clientName, function(err, projList) {
				if( !err){
					data.projList = projList;
				}
				indexRouteCallBack( res, err, data );
			});
		}else{
			indexRouteCallBack( res, err );
		}
	});
}
exports.indexGetProjDetails = function(req, res) {
	var projName = req.params.projName;
	model.getProjectByName( projName, function(err, project){
		if(!err){
			var data = {
				project: project[0]
			};
			getEvents(projName, function(err, eventList) {
				if( !err){
					data.eventList = eventList;
				}
				indexRouteCallBack( res, err, data );
			});
		}else{
			indexRouteCallBack( res, err );
		}
	});
}
exports.indexGetReportDetails = function(req, res) {
	getReportData( function(err, report) {
		var data = {};
		if( !err){
			data.report = report;
		}
		indexRouteCallBack( res, err, data );
	});
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
var getProjectsByClient = exports.getProjectsByClient = function(req, res) {
	var isRouterCall = typeof req === 'object' ? true : false;
	var clientName = isRouterCall ? req.query.clientName : req ;
	model.getProjectsByClient( clientName, function(err, projList){
		if( isRouterCall ){
			if(!err){
				res.send(projList);
			}
		}else{
			res(err, projList);
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
var getEvents = exports.getEvents = function(req, res) {
	var isRouterCall = typeof req === 'object' ? true : false;
	var projName = isRouterCall ? req.query.projName : req;
	model.getActivities( projName, function(err, eventList){
		if( isRouterCall ){
			if(!err){
				res.send(eventList);
			}
		}else{
			res(err, eventList);
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
var getReportData = exports.getReportData = function(req, res) {
	var isRouterCall = typeof req === 'object' ? true : false;
	model.getReportData( function(err, report){
		if( isRouterCall ){
			if(!err){
				res.send(report);
			}
		}else{
			req(err, report);
		}
	});
}
exports.redirect = function(req, res) {
	res.render('redirect');
}