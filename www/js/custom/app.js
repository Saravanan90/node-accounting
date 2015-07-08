( function( util, module, config ) {
	var app = window.App;
	
	app.getLaunchData = function(){
		var launchData = app.launchData;
		clearData();
		return launchData;
	};
	function clearData() {
		delete app.launchData;
		delete app.getLaunchData;
	}
	
	function invokeModule( module ) {
		Module.start( module );
		app.reloadUrl();
		resolveAll( config.modules[ module ] );
	}
	
	function resolveAll( config ) {
		if( !config )
			return;
		var dependencies = config.dependencies || [],
			unload = config.unload || [];
		resolveDependencies( dependencies );
		resolveUnload( unload );
	}
	
	function resolveDependencies( list ){
		for( var index = 0, len = list.length; index < len; index++ ){
			var module = list[index];
			if( ! modules[module].started )
				Module.start( module );
		}
	}
	function resolveUnload( list ){
		for( var index = 0, len = list.length; index < len; index++ ){
			var module = list[index];
			if( modules[module].started )
				Module.stop( module );
		}
	}
	
	var modules = {},
		appRouter,
		appView;
	
	var appRouterOpts = {
		type: 'router',
		routes: {
			'(clients)(/summary)(/add)': 'invokeClient',
			'clients/:client/projects(/summary)(/add)': 'invokeProject',
			'(*url/)projects/:project/events(/summary)(/add)': 'invokeEvent'
		},
		invokeClient: function() {
			invokeModule( 'client' );
		},
		invokeProject: function() {
			invokeModule( 'project' );
		},
		invokeEvent: function() {
			invokeModule( 'event' );
		}
	};
	
	var appViewOpts = {
		type: 'view',
		el: 'body',
		initialize: function( opts ) {
			this.events[ opts.transitionEndEvent + ' .page'] = 'pageTransitionCallback';
		},
		events: {
			'click #menu': 'closeMenu',
			'click .menuIcon': 'openMenu',
			'click #menu li': 'getReport'
		},
		pageTransitionCallback: function(event){
			var target = $(event.currentTarget);
			target.toggleClass('activePage');
			target.removeClass('animateTransform translateX100 translateX-100');
		},
		openMenu: function() {
			var menuList = $('#menu');
			menuList.removeClass('translateX-100');
		},
		closeMenu: function(event) {
			$(event.currentTarget).addClass('translateX-100');
		},
		getReport: function(){
							
		}
	};
	
	var Module = {
		register: function( name, params ) {
			util.checkType( 'string', name, 'Module Name' );
			util.checkType( 'object', params, 'Module Params' );
			if( modules[name] )
				throw Error( name + ' Module already registered..');
			params.name = name;
			modules[ name ] = {
				instance: module.extend( params ),
				started: false
			};
		},

		unregister: function( name ) {
			util.checkType( 'string', name, 'Module Name' );
			if( ! modules[name] )
				throw ReferenceError( name + ' Module yet to be registered...');
			Module.stop( name );
			delete modules[name];
		},

		start: function( name ) {
			util.checkType( 'string', name, 'Module Name' );
			var module1 = modules[name]; 
			if( ! module1 )
				throw ReferenceError( name + ' Module yet to be registered...');
			else if( module1.started ){
				throw Error( name + ' Module already started...' );
			}else{
				module1.instance.start();
				module1.started = true;
			}	
		},

		stop: function( name ) {
			util.checkType( 'string', name, 'Module Name' );
			var module1 = modules[name]; 
			if( ! module1 )
				throw ReferenceError( name + ' Module yet to be registered...');
			else if( module1.started ){
				module1.instance.stop();
				module1.started = false;
			}else{
				throwError( name + ' Module already stopped...' );
			}
		}
	};
	
	app.register = Module.register;
	
	app.start = function( data ) {
		app.launchData = data;
		appRouter = module.getComponent( appRouterOpts );
		appView = module.getComponent( appViewOpts, { transitionEndEvent: util.getTransitionEndEvent() } );
		app.History.start( config.defaults.history );
	}
	app.reloadUrl = function() {
		app.History.loadUrl();
	}
})( util, module, config );