exports.configure = function(params) {
	model = params.model
}
exports.index = function(req, res) {
	res.render('index');
}
exports.getLaunchData = function(req, res) {
	var tmpl = this;
	model.getClients( function(err, clientList){
		if(!err){
			var data = {
				clients: clientList,
				templates: tmpl
			}
			res.send(data);
		}
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