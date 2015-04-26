var app = ( function() {
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
		}),
		clientView = clientTmplObj.extend({
			el: '#clientSummary',
			initialize: function(data) {
				this.target = this.$el.find('#clientlist');
				this.collection.bind('reset', this.render, this );
				this.collection.bind('add', this.updateView, this );
			},
			updateView: function(newClient, response) {
				if(newClient.attributes.code !== 11000){
					this.target.append( this.template( {clients: [newClient.attributes], lastIndex: this.collection.length -1 } ) );
				}
			},
			render: function() {
				this.target.html(this.template( {clients: this.collection.toJSON(), lastIndex: 0 } ));
			},
			events: {
				'click #addIcon': 'addClient',
				'click .js-editClient': 'editClient'
			},
			addClient: function() {
				var addClientPopup = $('#addClientPopup');
				addClientPopup.removeClass('scale0');
			},
			editClient: function(event) {
				var clientIndex = event.currentTarget.getAttribute('data-index'),
					targetClient = this.collection.at( clientIndex );
				
				this.model.set( targetClient.toJSON() );
			}
		}),
		projectView = projectTmplObj.extend({
			el: '#projSummary',
			initialize: function(options) {
				this.target = this.$el.find('#clientDetail');
				this.projCollection = this.model.get('projList');
				this.projModel = options.projModel;
				this.projCollection.bind('reset', this.render, this);
				this.projCollection.bind('add', this.updateProjList, this);
				this.model.bind('change:name', this.fetchProjList, this);
			},
			render: function() {
				this.target.html(this.template( {clientData: this.model.toJSON(), projList: this.projCollection.toJSON(), lastIndex: 0 } ));
				transitPage( this.$el );
				this.projListTarget = this.target.find('#projlist');
			},
			updateProjList: function(newProj, response) {
				if(newProj.attributes.code !== 11000){
					this.projListTarget.append( this.template( {clientData: null, projList: [newProj.attributes], lastIndex: this.projCollection.length -1} ) );
				}
			},
			events: {
				'click #addIcon': 'addProject',
				'click .js-editClient': 'editProject'
			},
			addProject: function() {
				var addProjPopup = $('#addProjectPopup');
				addProjPopup.removeClass('scale0');
			},
			editProject: function(event) {
				var projIndex = event.currentTarget.getAttribute('data-index'),
					targetProj = this.projCollection.at( projIndex );
				
				this.projModel.set( targetProj.toJSON() );
			},
			fetchProjList: function() {
				var model = this.model;
				model.get('projList').fetch({
					data:{
						clientName: model.get('name')
					},
					reset: true,
					success: function(model, response, options) {
					},
					error: function(model, response, options) {			
					}
				});
			}
		}),
		eventView = eventTmplObj.extend({
			el: '#eventSummary',
			initialize: function() {
				this.target = this.$el.find('#projDetail');
				this.eventCollection = this.model.get('eventList');
				this.eventCollection.bind('reset', this.render, this);
				this.eventCollection.bind('add', this.updateEventList, this);
				this.model.bind('change:name', this.fetchEventList, this);
			},
			render: function() {
				this.target.html(this.template( {projData: this.model.toJSON(), eventList: this.eventCollection.toJSON() } ));
				transitPage( this.$el );
				this.eventListTarget = this.target.find('#eventlist');
			},
			updateEventList: function(newEvent, response) {
				if(newEvent.attributes.code !== 11000){
					this.eventListTarget.append( this.template( {projData: null, eventList: [newEvent.attributes]} ) );
				}
			},
			events: {
				'click #addIcon': 'addEvent'
			},
			addEvent: function() {
				var addProjPopup = $('#addEventPopup');
				addProjPopup.removeClass('scale0');
			},
			fetchEventList: function() {
				var model = this.model;
				model.get('eventList').fetch({
					data:{
						projName: model.get('name')
					},
					reset: true,
					success: function(model, response, options) {
					},
					error: function(model, response, options) {			
					}
				});
			}
		}),
		addClientView = Backbone.View.extend({
			el: '#addClientPopup',
			initialize: function(data) {
				this.collection.bind('add', this.clientAdditionCallBack, this );
			},
			events: {
				'submit form': 'submitModelData',
				'click #closeIcon': 'closePopup'
			},
			submitModelData: function(event) {
				event.preventDefault();
				var	newClientData = getJSON( $(event.currentTarget).serializeArray() );
				this.collection.create(newClientData,{wait: true});
			},
			clientAdditionCallBack: function( data, response ) {
				if(data.attributes.code === 11000){
					alert('Duplicate Client...');
					this.clearFields();
				}else{
					alert('Client Added Successfully...');
					this.closePopup();
				}
			},
			clearFields: function() {
				this.$el.find('input[type="text"]').val('');
			},
			closePopup: function() {
				this.$el.addClass('scale0');
				this.clearFields();
			}
		}),
		addProjView = Backbone.View.extend({
			el: '#addProjectPopup',
			initialize: function(data) {
				this.projCollection = this.model.get('projList');
				this.projCollection.bind('add', this.projAdditionCallBack, this);
			},
			events: {
				'submit form': 'submitModelData',
				'click #closeIcon': 'closePopup'
			},
			submitModelData: function(event) {
				event.preventDefault();
				var	newProjData = getJSON( $(event.currentTarget).serializeArray() );
				newProjData.client = this.model.get('name');
				this.projCollection.create(newProjData,{wait: true});
			},
			projAdditionCallBack: function( data, response ) {
				if(data.attributes.code === 11000){
					alert('Duplicate Project...');
					this.clearFields();
				}else{
					alert('Project Added Successfully...');
					this.closePopup();
				}
			},
			clearFields: function() {
				this.$el.find('input[type="text"]').val('');
			},
			closePopup: function() {
				this.$el.addClass('scale0');
				this.clearFields();
			}
		}),
		addEventView = Backbone.View.extend({
			el: '#addEventPopup',
			initialize: function(data) {
				this.eventCollection = this.model.get('eventList');
				this.eventCollection.bind('add', this.eventAdditionCallBack, this);
			},
			events: {
				'submit form': 'submitModelData',
				'click #closeIcon': 'closePopup'
			},
			submitModelData: function(event) {
				event.preventDefault();
				var	newEventData = getJSON( $(event.currentTarget).serializeArray() );
				newEventData.project = this.model.get('name');
				this.eventCollection.create(newEventData,{wait: true});
			},
			eventAdditionCallBack: function( data, response ) {
				if(data.attributes.code === 11000){
					alert('Duplicate Event...');
					this.clearFields();
				}else{
					alert('Event Added Successfully...');
					this.closePopup();
				}
			},
			clearFields: function() {
				this.$el.find('input[type="text"]').val('');
			},
			closePopup: function() {
				this.$el.addClass('scale0');
				this.clearFields();
			}
		}),
		reportView = reportTmplObj.extend({
			el: '#report',
			initialize: function(options) {
				this.target = this.$el.find('#reportData');
				this.topClientsList = options.topClientsList;
				this.model.bind('dataUpdated', this.generateReportData, this);
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
				transitPage( this.$el );
			}
		}),
		topClientsView = topClientsTmplObj.extend({
			el: '#top5ClientsPopup',
			initialize: function(options) {
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
		}),
		appView = Backbone.View.extend({
			el: 'body',
			initialize: function(clients) {
				_.extend( (topClientsObj ={}), Backbone.Events );
				var clientDetail = new clientDetailModel(),
					projDetail = new projDetailModel(),
					clientList = new clientCollection(),
					report = new clientReportModel(),
					addClientViewObj = new addClientView({
						collection: clientList
					}),
					addProjViewObj = new addProjView({
						model: clientDetail
					}),
					addEventViewObj = new addEventView({
						model: projDetail
					}),
					clientViewObj = new clientView({
						collection: clientList,
						model: clientDetail
					}),
					projViewObj = new projectView({
						model: clientDetail,
						projModel: projDetail
					}),
					eventViewObj = new eventView({
						model: projDetail
					}),
					reportViewObj = new reportView({
						model: report,
						topClientsList: topClientsObj
					}),
					topClientsViewObj = new topClientsView({
						topClients: topClientsObj
					});
				clientList.reset(clients);
				this.reportModel = report;
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
			}
		});
	
	_.extend( clientDetailModel.prototype.defaults, clientSummaryModel.prototype.defaults );
	_.extend( projDetailModel.prototype.defaults, projSummaryModel.prototype.defaults );
	_.extend( clientView.prototype.defaults, clientTmplObj.prototype.defaults );
	_.extend( projectView.prototype.defaults, projectTmplObj.prototype.defaults );
	_.extend( eventView.prototype.defaults, eventTmplObj.prototype.defaults );
	_.extend( reportView.prototype.defaults, reportTmplObj.prototype.defaults );
	_.extend( topClientsView.prototype.defaults, topClientsTmplObj.prototype.defaults );
	
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
	
	function transitPage( targetPage ) {
		var currentPage = $('.activePage');
		targetPage.removeClass('translateX100').addClass('activePage');
		currentPage.removeClass('activePage');
	}
	
	return{
		start: function(clients) {
			new appView(clients);
		}
	}
} )();