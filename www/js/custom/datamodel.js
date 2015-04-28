var datamodel = (function(){
	var clientSummaryModel = Backbone.Model.extend({
			//	used to define any client side validations for the models saved in clientCollection.
			defaults: {
				name: '',
				eMail: '',
				info: ''
			}
		}),
		projSummaryModel = Backbone.Model.extend({
			//	used to define any client side validations for the models saved in projCollection.
			defaults: {
				name: '',
				cost: '',
				client: ''
			}
		}),
		eventSummaryModel = Backbone.Model.extend({
			//	used to define any client side validations for the models saved in eventCollection.
			defaults: {
				name: '',
				time: '',
				project: ''
			}
		}),
		projCollection = Backbone.Collection.extend({
			url: '/project',
			model: projSummaryModel
		}),
		eventCollection = Backbone.Collection.extend({
			url: '/event',
			model: eventSummaryModel
		}),
		clientCollection = Backbone.Collection.extend({
			url: '/client',
			model: clientSummaryModel
		}),
		clientDetailModel = clientSummaryModel.extend({
			defaults: {
				projList: new projCollection()
			}
		}),
		projDetailModel = projSummaryModel.extend({
			defaults: {
				eventList: new eventCollection()
			}
		}),
		clientReportModel = Backbone.Model.extend({
			url: '/report',
			parse: function( resp, options ){
				this.get( 'clientList').reset(resp.clientList );
				this.get( 'projList').reset(resp.projList );
				this.get( 'eventList').reset(resp.eventList );
				this.trigger('dataUpdated');
			},
			defaults: {
				clientList: new clientCollection(),
				projList: new projCollection(),
				eventList: new eventCollection()
			}
		});
	_.extend( clientDetailModel.prototype.defaults, clientSummaryModel.prototype.defaults );
	_.extend( projDetailModel.prototype.defaults, projSummaryModel.prototype.defaults );
	return{
		getClientDetailModel: function() {
			return new clientDetailModel();
		},
		getProjDetailModel: function() {
			return new projDetailModel();
		},
		getClientCollection: function() {
			return new clientCollection();
		},
		getClientReportModel: function() {
			return new clientReportModel();
		}
	}
})()