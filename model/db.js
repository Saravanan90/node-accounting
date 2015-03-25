var mongoose = require('mongoose'),
	db = mongoose.connection,
	Client = null,
	Project = null,
	Activity = null;

db.on('error', console.error);
	
db.once('open', function() {
	console.log('Connection Established....');
	var Schema = mongoose.Schema,
		clientSchema = new Schema({
			name: { type: String, unique: true },
			eMail: String,
			info: String
		}),
		projectSchema = new Schema({
			name: { type: String, unique: true },
			cost: Number,
			client: String
		}),
		activitySchema = new Schema({
			name: String,
			time: Number,
			project: String
		}); 
	Client = mongoose.model('Client', clientSchema);
	Project = mongoose.model('project', projectSchema);
	Activity = mongoose.model('activity', activitySchema);
});

exports.connect = function(dburl, callback) {
	mongoose.connect(dburl);
}
exports.disconnect = function(callback) {
	mongoose.disconnect(callback);
}	
exports.addClient = function(client, callback) {
	var newClient = new Client(client);
	newClient.save( function(err, data, numberAffected) {
		callback(err, data);
	});
};
exports.addProject = function(project, callback) {
	var newProject = new Project(project);
	newProject.save( function(err) {
		callback(err);
	});
};
exports.addActivity = function(activity, callback) {
	var newActivity = new Activity(activity);
	newActivity.save( function(err) {
		callback(err);
	});
};
exports.getClients = function(callback) {
	Client.find( {}, function(err, clients) {
		callback(err, clients);
	});
};
exports.getProjects = function() {

};
exports.getActivities = function() {

};