var router = ( function() {
	var AppRouter = Backbone.Router.extend({
			initialize: function(routeController) {
				this.routeController = routeController;
			},
			routes: {
				'':'navigateToClients',
				'clients': 'showClientsList',
				':clientName/projects': 'showProjectSummary',
				':projectName/events': 'showEventSummary',
				'report': 'showReport',
				'*path:pageHash': 'transitPageBack'
			},
			transitPageBack: function(path, pageHash){
				var activePageId = $('.activePage').attr('id');
				if( pageHash !== activePageId ){
					var target = $('#'+ pageHash);
					util.transitPage(target,{reverse: true});
				}else{
					var activePopupId = $('.activePopup').attr('id');
					this.closePopup( activePopupId );
				}
				removeTrailingUrlFragment(pageHash);
				//Backbone.history.history.back();
			},
			navigateToClients: function() {
				navigateTo('clients');
			},
			showClientsList: function(){
				this.routeController.trigger('showClientsList');
			},
			showProjectSummary: function(clientName){
				this.routeController.trigger('showProjectSummary', clientName);
			},
			showEventSummary: function(projectName){
				this.routeController.trigger('showEventSummary', projectName);
			},
			showReport: function(){
				this.routeController.trigger('showReport');
			},
			closePopup: function(popupHash) {
				var target = $('#'+ popupHash);
				target.find('#closeIcon').trigger('click');
			}
		}), routerObj;
	function navigateTo(url, opts){
		var opts  = opts || {};
		routerObj.navigate( url, {
			trigger: opts.trigger !== undefined ? opts.trigger : true,
			replace: opts.replace !== undefined ? opts.replace : false
		});
	}
	function removeTrailingUrlFragment(fragment) {
		var regex = new RegExp('/'+ fragment + '$');
		var url = Backbone.history.fragment.replace(regex, '');
		navigateTo(url, { trigger: false, replace: true });
	}
	return{
		init: function( routeController ){
			routerObj = new AppRouter( routeController );
		},
		navigateTo: function(url) {
			navigateTo(url);
		},
		appendUrlWithoutTriggerUpdate: function(pageName) {
			var url = Backbone.history.fragment + '/' + pageName;
			navigateTo(url, { trigger: false, replace: true });
		},
		appendUrlWithoutTrigger: function(pageName) {
			var url = Backbone.history.fragment + '/' + pageName;
			navigateTo(url, { trigger: false });
		}
	}	
})()