( function() {
	appTemplates = [];
	var clientSummaryModel = Backbone.Model.extend({
		//	used to define any client side validations for the models saved in clientCollection.
		defaults: {
			name: '',
			eMail: '',
			info: ''
		}
	});
	var projSummaryModel = Backbone.Model.extend({
		//	used to define any client side validations for the models saved in projCollection.
		defaults: {
			name: '',
			cost: ''
		}
	});
	var eventSummaryModel = Backbone.Model.extend({
		//	used to define any client side validations for the models saved in eventCollection.
		defaults: {
			desc: '',
			time: ''
		}
	});
	var projCollection = Backbone.Collection.extend({
		model: projSummaryModel
	});
	var eventCollection = Backbone.Collection.extend({
		model: eventSummaryModel
	});
	var clientCollection = Backbone.Collection.extend({
		url: '/client',
		model: clientSummaryModel
	});
	var clientDetailModel = clientSummaryModel.extend({
		url: '/clientDetails',
		defaults: {
			projList: new projCollection(),
		}
	});
	_.extend( clientDetailModel.prototype.defaults, clientSummaryModel.prototype.defaults );
	
	var projDetailModel = projSummaryModel.extend({
		url: '/projDetails',
		defaults: {
			eventList: new eventCollection(),
		}
	});
	_.extend( projDetailModel.prototype.defaults, projSummaryModel.prototype.defaults );
	
	var clientView = Backbone.View.extend({
		initialize: function(data) {
			this.template = _.template( appTemplates['client'] );
			this.target = this.$el.find('#clientlist');
			this.render();
			this.collection.bind('add', this.updateView, this );
		},
		updateView: function(newClient, response) {
			if(newClient.attributes.code !== 11000){
				this.target.append( this.template( {clients: [newClient.attributes]} ) );
			}
		},
		render: function() {
			this.target.html(this.template( {clients: this.collection.toJSON()} ));
		},
		events: {
			'click .menuIcon': 'openMenu',
			'click #addIcon': 'addClient',
			'click .js-editClient': 'editClient'
		},
		openMenu: function() {
			var menuList = $('#menu');
			menuList.removeClass('translateX-100');
		},
		closeMenu: function(event) {
			$(event.currentTarget).addClass('translateX-100');
		},
		addClient: function() {
			var addClientPopup = $('#addClientPopup');
			addClientPopup.removeClass('scale0');
		},
		editClient: function(event) {
			 
		}
	});
	
	var addClientView = Backbone.View.extend({
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
	});
	
	var appView = Backbone.View.extend({
		events: {
			'click #menu': 'closeMenu'
		},
		closeMenu: function(event) {
			$(event.currentTarget).addClass('translateX-100');
		},
	});
	
	var appViewObj = new appView({
		el: 'body'
	});
	
	function getJSON( formDataArray ) {
		var formJSON = {};
		for( var inx = 0, length = formDataArray.length; inx < length; inx++ ){
			var obj = formDataArray[inx];
			formJSON[obj.name] = obj.value;
		}
		return formJSON;
	}
	$.ajax({
		url: '/getLaunchData',
	}).done( function(data) {
		appTemplates = data.templates;
		var clientList = new clientCollection( data.clients );
		var addClientViewObj = new addClientView({
			el: '#addClientPopup',
			collection: clientList
		});
		var clientViewObj = new clientView({
			el: '#clientSummary',
			collection: clientList
		});
	});
} )();