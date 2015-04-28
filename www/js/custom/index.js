var app = ( function() {
	var appView = Backbone.View.extend({
			el: 'body',
			initialize: function(clients, transitionEndEvent) {
				_.extend( (topClientsObj ={}), Backbone.Events );
				var clientDetail = datamodel.getClientDetailModel(),
					projDetail = datamodel.getProjDetailModel(),
					clientList = datamodel.getClientCollection(),
					reportData = datamodel.getClientReportModel(),
					addClientViewObj = clientview.getAddClientView({
						collection: clientList
					}),
					addProjViewObj = projectview.getAddProjView({
						model: clientDetail
					}),
					addEventViewObj = eventview.getAddEventView({
						model: projDetail
					}),
					clientViewObj = clientview.getClientView({
						collection: clientList,
						model: clientDetail
					}),
					projViewObj = projectview.getProjectView({
						model: clientDetail,
						projModel: projDetail
					}),
					eventViewObj = eventview.getEventView({
						model: projDetail
					}),
					reportViewObj = report.getReportView({
						model: reportData,
						topClientsList: topClientsObj
					}),
					topClientsViewObj = report.getTopClientsView({
						topClients: topClientsObj
					});
				this.reportModel = reportData;
				this.events[transitionEndEvent + ' .page.animateTransform'] = 'pageTransitionCallback';
				this.events[transitionEndEvent + ' .popup.animateTransform'] = 'popupTransitionCallback';
				Backbone.history.start({silent: true, root: '/Accounting'});
				
				clientList.reset(clients);
			},
			events: {
				'click #menu': 'closeMenu',
				'click .menuIcon': 'openMenu',
				'click #menu li': 'getReport'
			},
			openMenu: function() {
				var menuList = $('#menu');
				menuList.removeClass('translateX-100');
			},
			closeMenu: function(event) {
				$(event.currentTarget).addClass('translateX-100');
			},
			getReport: function(){
				this.reportModel.fetch({reset: true});
			},
			pageTransitionCallback: function(event){
				var target = $(event.currentTarget);
				if( ! target.hasClass('activePage') ){
					router.setWindowHash( 'page/' + target.attr('id') );
				}
				target.removeClass('animateTransform').toggleClass('activePage');
			},
			popupTransitionCallback: function(event){
				var target = event.currentTarget;
				if( $(target).hasClass('activePopup') )
					router.setWindowHash( 'popup/' + target.id );
				else if( window.location.hash.indexOf('#popup') !== -1 )
					Backbone.history.history.back();
			}
		});
	return{
		start: function(clients) {
			new appView(clients, util.getTransitionEndEvent() );
		}
	}
} )();