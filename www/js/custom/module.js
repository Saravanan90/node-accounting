( function( app ) {
	var module = window.module = {};
	var componentMap = {
		'model': app.Model, 
		'view': app.View,
		'collection': app.Collection,
		'router': app.Router,
		'controller': app.Controller
	}
	var getComponent = function( opts, params ){
		if( typeof opts.type !== 'string' )
			throw TypeError("Component type is not a string...");
			
		var componentType = opts.type.toLowerCase();
		if( componentMap[componentType] === undefined )
			throw Error("Component type not supported...");
		
		if( componentType === 'controller' ){
			opts.parent = this;
		}else{
			opts.controller = this.controller;
		}
		var customComponent = componentMap[componentType].extend(opts);
		return ( params === false ? customComponent : new customComponent( params ) );
	}
	
	var BaseModule = {
		views: {},
		collections: {},
		models: {},
		start: function() {
			this.name = this.configs.name;
			this.controller = getComponent.call( this, this.configs.controllerOpts, false );
			this.router = getComponent.call( this, this.configs.routerOpts );
			this.controller.start( this.name );
		},
		stop: function() {
		
		}
	};
	
	module.extend = function( params ) {
		return Object.create( BaseModule, { 
			configs: { value: params }
		});
	}
	module.getComponent = getComponent;
})( App );