var config = ( function( app ) {
	var appFramework = Backbone;
	
	app.Model = appFramework.Model;
	app.View = appFramework.View;
	app.Collection = appFramework.Collection;
	app.Router = appFramework.Router;
	app.History = appFramework.history;
	app.Controller = appFramework.Events;
		
	var defaults = {
		history: {
			pushState: true, 
			root: '/Accounting'
		}
	};
	var modules = {
		'client': {
			'dependencies': [],
			'unload': []
		},
		'project': {
			'dependencies': ['client'],
			'unload': []
		},
		'event': {
			'dependencies': ['client', 'project'],
			'unload': []
		}
	};
	return {
		defaults: defaults,
		modules: modules
	}
} )( App );