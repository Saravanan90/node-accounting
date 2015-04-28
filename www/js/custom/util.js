var util = (function() {
	function getJSON( formDataArray ) {
		var formJSON = {};
		for( var inx = 0, length = formDataArray.length; inx < length; inx++ ){
			var obj = formDataArray[inx];
			formJSON[obj.name] = obj.value;
		}
		return formJSON;
	}	
	Array.prototype.sum = function(){
		var sum = 0, arr = this;
		for( var inx = 0, len = arr.length; inx < len; inx++ ){
			sum += arr[inx];
		}
		return sum;
	}
	Backbone.Model.prototype.hasEmptyAttributes = function(){
		var obj = this.attributes;
		for(var key in obj){
			if(_.isEmpty(obj[key])) 
				return true;
		} 
		return false; 
	}
	Backbone.Model.prototype.validate = function(attrs) {
		if( this.hasEmptyAttributes() )
			return 'Fields cannot be empty.';
	}
	Backbone.Model.prototype.initialize = function() {
		this.on('invalid', this.showErrMsg, this);
	},
	Backbone.Model.prototype.showErrMsg = function(model, error) {
		alert(error);
	}
	Backbone.View.prototype.template = App.Templates;
	
	function transitPage( inPage, opts ) {
		var outPage = $('.activePage');
		if(opts){
			outPage.addClass('animateTransform translateX100');
			inPage.addClass('animateTransform').removeClass('translateX-100');
		}else{
			outPage.addClass('animateTransform translateX-100');
			inPage.addClass('animateTransform').removeClass('translateX100');
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
		}
	}
})()