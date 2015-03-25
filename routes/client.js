exports.configure = function(params) {
	model = params.model
}
exports.getClientDetails = function(req, res) {
	res.render('index', {
		title: "Math Calculator"
	});
}