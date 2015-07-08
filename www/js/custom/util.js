var util = (function( app ) {
	function getJSON( formDataArray ) {
		var formJSON = {};
		for( var inx = 0, length = formDataArray.length; inx < length; inx++ ){
			var obj = formDataArray[inx];
			formJSON[obj.name] = obj.value;
		}
		return formJSON;
	}	
	function checkType( type, value, param ) {
		checkValue( value, param );
		if( typeof value !== type )
			throw TypeError( param + ' must be a '+ type );
	}

	function checkValue( value, param ) {
		if( value === null || value === undefined )
			throw ReferenceError( param + ' must be defined...' );
	}
	Array.prototype.sum = function(){
		var sum = 0, arr = this;
		for( var inx = 0, len = arr.length; inx < len; inx++ ){
			sum += arr[inx];
		}
		return sum;
	}
	app.Model.prototype.hasEmptyAttributes = function(){
		var obj = this.attributes;
		for(var key in obj){
			if(_.isEmpty(obj[key])) 
				return true;
		} 
		return false; 
	}
	app.Model.prototype.validate = function(attrs) {
		if( this.hasEmptyAttributes() )
			return 'Fields cannot be empty.';
	}
	app.Model.prototype.initialize = function() {
		this.on('invalid', this.showErrMsg, this);
	},
	app.Model.prototype.showErrMsg = function(model, error) {
		alert(error);
	}
	
	app.View.prototype.template = app.Templates;
	
	app.Controller.extend = function( opts ) {
		var obj = Object.create( this );
		for( var opt in opts) {
			obj[opt] = opts[opt];
		}
		return obj;
	}
	app.Controller.start = function() {
		var events = this.events,
			moduleName = this.parent.name;
		for( var event in events ){
			var callback = events[event];
			event = moduleName + '_' + event;
			this.on(event, this[callback], this);
		}
	}
	app.Controller.publish = function( event, data ) {
		var moduleName = this.parent.name;
			event = moduleName + '_' + event;
		this.trigger( event, data );
	}
	app.Controller.stop = function() {
		var events = this.events;
		for( var event in events ){
			var callback = events[event];
			this.off(event, this[callback], this);
		}
	}
	
	app.Router.prototype.updateRoute = function( fragment ) {
		var url = ( this.root || '' ) + '/' + fragment;
		this.navigate( url );
	}
	app.Router.prototype.replaceRoute = function( fragment ) {
		var url = ( this.root || '' ) + '/' + fragment;
		this.navigate( url, {
			replace: true
		} );
	}
	app.Router.prototype.triggerRoute = function( fragment ) {
		var url = ( this.root || '' ) + '/' + fragment;
		this.navigate( url, {
			trigger: true
		} );
	}
	
	function transitPage( inPage, opts ) {
		var outPage = $('.activePage');
		if( inPage.attr('id') === outPage.attr('id') )
			return;
		if( ! outPage[0] ){
			inPage.addClass('activePage');
		}else{
			if(opts){
				inPage.addClass('animateTransform translateX-100');
			}else{
				inPage.addClass('animateTransform translateX100');
			}
			setTimeout( function() {
				if(opts){
					outPage.addClass('animateTransform translateX100');
					inPage.removeClass('translateX-100');
				}else{
					outPage.addClass('animateTransform translateX-100');
					inPage.removeClass('translateX100');
				}
			}, 100 );
		} 
	}
	var transitionEndEvent = function(){
		var el = document.createElement('div'),
			transitionMap = {
				'transition': 'transitionend',
				'OTransition': 'oTransitionEnd',
				'MozTransition': 'transitionend',
				'WebkitTransition': 'webkitTransitionEnd'
			};
		for( var style in transitionMap ){
			if( el.style[style] !== undefined )
				return transitionMap[style];
		}
	}();
	return{
		getJSON: function(array) {
			return getJSON(array);
		},
		getTransitionEndEvent: function(array) {
			return transitionEndEvent;
		},
		transitPage: function( inPage, opts ) {
			transitPage( inPage, opts );
		},
		checkType: function( type, value, param ) {
			checkType( type, value, param );
		},
		checkValue: function( value, param ) {
			checkValue( value, param );
		}
	}
})(App);