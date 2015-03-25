exports.configure = function(params) {
	model = params.model
}
exports.index = function(req, res) {
	model.getClients( function(err, clientList){
		if(!err){
			res.render('index', {
				title: 'Accounting',
				clients: clientList
			});
		}
	});
}
exports.addClient = function(req, res) {
	console.log('Add Request Received..' + req.body.info);
	var newClient = {
		name: req.body.name,
		eMail: req.body.eMail,
		info: req.body.info
	};
	model.addClient( newClient, function(err, data) {
		if(err){
			res.status(200).send(err);
		}else{
			res.render('client', {
				clients: [data]
			});
		}
	});
	/*model.getClients( function(err, clientList){
		if(!err){
			res.render('index', {
				title: 'Accounting',
				clients: clientList
			});
		}
	});*/
}