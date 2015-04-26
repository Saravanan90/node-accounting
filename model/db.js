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
exports.getProjects = function( clientName, callback) {
	var queryObj = clientName !== '' ? { client: clientName } : {};
	Project.find( queryObj, function(err, projects) {
		callback(err, projects);
	});
};
exports.getActivities = function(projName, callback) {
	var queryObj = projName !== '' ? { project: projName } : {};
	Activity.find( queryObj, function(err, activities) {
		callback(err, activities);
	});
};
exports.getReportData = function(callback) {
	var report = {}, that = this;
	that.getClients(function(err, clients){
		if(!err){
			report.clientList = clients;
			that.getProjects('',function(err, projects){
				if(!err){
					report.projList = projects;
					that.getActivities('',function(err, events){
						if(!err){
							report.eventList = events;
							callback('', report);
						}else{
							callback(err);
						}
					});
				}else{
					callback(err);
				}
			});
		}else{
			callback(err);
		}
	});
};