var app = ( function() {
	var appView = Backbone.View.extend({
			el: 'body',
			initialize: function(serverData, transitionEndEvent, appRouteController) {
				this.appRouteController = appRouteController;
				this.startListening();
				this.events[transitionEndEvent + ' .page.animateTransform'] = 'pageTransitionCallback';
				this.events[transitionEndEvent + ' .popup.animateTransform'] = 'popupTransitionCallback';
				
				this.initServerData = serverData;
				Backbone.history.start({pushState: true, root: '/Accounting'});
			},
			startListening : function(){
				var routeEvents = this.routeEvents;
				for ( var event in routeEvents) {
					var callback = routeEvents[event];
					this.appRouteController.on(event, this[callback], this);
				}
			},
			routeEvents: {
				'showClientsList': 'makeClientView',
				'showProjectSummary': 'makeProjectView',
				'showEventSummary': 'makeEventView',
				'showReport': 'makeReportView',
			},
			events: {
				'click #menu': 'closeMenu',
				'click .menuIcon': 'openMenu',
				'click #menu li': 'getReport'
			},
			makeClientView: function() {			
				if( ! this.clientViewObj )
					this.clientViewObj = clientview.getClientView();
				if( this.initServerData ){
					this.clientViewObj.collection.reset(this.initServerData.clients);
					this.clearServerData();
				}else{
					this.clientViewObj.collection.fetch({reset: true});
				}
			},
			makeProjectView: function(clientName) {
				if( ! this.projViewObj )
					this.projViewObj = projectview.getProjectView();
				if( this.initServerData ){
					this.projViewObj.model.set(this.initServerData.client, {silent: true});
					this.projViewObj.projCollection.reset(this.initServerData.projList);
					this.clearServerData();
				}else{
					this.projViewObj.model.set('name', clientName, {silent: true});
					this.projViewObj.model.trigger('change:name');
				}
			},
			makeEventView: function(projectName) {
				if( ! this.eventViewObj )
					this.eventViewObj = eventview.getEventView();
				if( this.initServerData ){
					this.eventViewObj.model.set(this.initServerData.project, {silent: true});
					this.eventViewObj.eventCollection.reset(this.initServerData.eventList);
					this.clearServerData();
				}else{
					this.eventViewObj.model.set('name', projectName, {silent: true});
					this.eventViewObj.model.trigger('change:name');
				}
			},
			makeReportView: function() {
				if( ! this.reportViewObj )
					this.reportViewObj = report.getReportView();
				this.reportViewObj.model.fetch({reset: true});
			},
			clearServerData: function() {
				delete this.initServerData;
			},
			openMenu: function() {
				var menuList = $('#menu');
				menuList.removeClass('translateX-100');
			},
			closeMenu: function(event) {
				$(event.currentTarget).addClass('translateX-100');
			},
			getReport: function(){
				var activePageId = $('.activePage').attr('id');
				router.appendUrlWithoutTriggerUpdate( activePageId );
				router.navigateTo( 'report' );				
			},
			pageTransitionCallback: function(event){
				var target = $(event.currentTarget);
				target.removeClass('animateTransform').toggleClass('activePage');
			},
			popupTransitionCallback: function(event){
				var target = event.currentTarget,
					urlFragment = Backbone.history.fragment,
					activePopupId = $('.activePopup').attr('id');
				if( ! $(target).hasClass('activePopup') ){
					var activePageId = $('.activePage').attr('id');
					router.appendUrlWithoutTriggerUpdate( activePageId );
					router.appendUrlWithoutTrigger( target.id );
				}
				else if( urlFragment.indexOf( activePopupId ) !== -1 )
					Backbone.history.history.back();
				$(target).toggleClass('activePopup');
			}
		});
	return{
		start: function(serverData) {
			var AppRouteController = _.extend({}, Backbone.Events);
			router.init( AppRouteController );
			new appView(serverData, util.getTransitionEndEvent(), AppRouteController );
		}
	}
} )();