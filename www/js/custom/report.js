var report = (function() {
	var reportView = Backbone.View.extend({
			el: '#report',
			initialize: function(options) {
				this.template = this.template.report;
				this.target = this.$el.find('#reportData');
				this.topClientsList = _.extend( {}, Backbone.Events );
				this.model = datamodel.getClientReportModel();
				this.model.bind('dataUpdated', this.generateReportData, this);
				
				this.topClientsViewObj = new topClientsView({
					topClients: this.topClientsList
				});
			},
			events:{
				'click #topFiveBtn': 'getTopFiveClients'
			},
			getTopFiveClients: function() {
				this.topClientsList.trigger('topClientsSelected', this.topClientsList.data);
			},
			generateReportData: function() {
				var model = this.model,
					clients = model.get('clientList'),
					projects = model.get('projList'),
					events = model.get('eventList');
				
				clientNameList = clients.pluck('name');
				projGroupSet = _.groupBy(projects.toJSON(), 'client');
				eventGroupSet = _.groupBy(events.toJSON(), 'project');
				
				_.map(projGroupSet, function(projects,client){
					var totalEarning = 0;
					_.each( projects, function(project) {
						var totalTime = _.pluck( eventGroupSet[project.name], 'time' ).sum();
						project.totalTime = totalTime;
						project.totalCost = totalTime * project.cost;
						totalEarning += project.totalCost;
					});
					projects.totalEarning = totalEarning;
				});
				this.render({
					clients: clientNameList,
					projects: projGroupSet
				});
				this.topClientsList.data = _.sortBy(projGroupSet,'totalEarning').slice('-5').reverse();
			},
			render: function(tmplData) {
				this.target.html(this.template( tmplData ));
				util.transitPage( this.$el );
			}
		}),
		topClientsView = Backbone.View.extend({
			el: '#top5ClientsPopup',
			initialize: function(options) {
				this.template = this.template.topClients;
				this.topClients = options.topClients;
				this.target = this.$el.find('#top5List');
				this.topClients.on('topClientsSelected', this.render, this);
			},
			events:{
				'click #closeIcon': 'hideEle'
			},
			render: function(tmplData) {
				this.target.html(this.template( { topClients: tmplData } ));
				this.showEle();
			},
			showEle: function() {
				this.$el.removeClass('scale0');
			},
			hideEle: function() {
				this.$el.addClass('scale0');
			}
		});
	return{
		getReportView: function(params) {
			return new reportView(params)
		},
		getTopClientsView: function(params) {
			return new topClientsView(params)
		}
	}
})()