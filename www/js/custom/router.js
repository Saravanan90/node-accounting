var router = ( function() {
	var AppRouter = Backbone.Router.extend({
			initialize: function(options){
				this.startHash = options.startHash;
			},
			routes: {
				'page/:pageHash': 'transitPageBack'
			},
			transitPageBack: function(pageHash){
				var prevURL = event.oldURL;
				if( prevURL.indexOf( this.startHash ) !== -1 )
					return;
				if( prevURL.indexOf('#popup') === -1 ){
					var target = $('#'+ pageHash);
					util.transitPage(target,{reverse: true});
				}else{
					var urlArray = prevURL.split('/');
					this.closePopup( urlArray.reverse()[0] );
				}
			},
			closePopup: function(popupHash) {
				var target = $('#'+ popupHash);
				target.find('#closeIcon').trigger('click');
			}
		}),	
		router = new AppRouter({startHash: 'clientSummary'});
	function setWindowHash(hash){
		if( window.location.hash !== '#' + hash ) 
			router.navigate( hash, {trigger: false});
	}
	return{
		setWindowHash: function(hash) { 
			setWindowHash(hash)
		}
	}	
})()