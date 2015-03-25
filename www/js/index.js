( function() {
	var clientView = Backbone.View.extend({
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
		editClient: function() {
			alert('Edit Client Data...');
		}
	});
	
	var addClientView = Backbone.View.extend({
		events: {
			'submit form': 'submitForm',
			'click #closeIcon': 'closePopup'
		},
		submitForm: function(event) {
			event.preventDefault();
			var params = {
				data: $(event.currentTarget).serialize(),
				url: '/addClient'
			}
			console.log( params.data );
			makeAjaxCall( params, this.clientAdditionCallBack.bind(this) );
		},
		clientAdditionCallBack: function( data ) {
			if(data.code === 11000){
				alert('Duplicate Client...');
				this.clearFields();
			}else{
				alert('Client Added Successfully...');
				var clientList = $('#clientlist');
				clientList.prepend(data);
				this.closePopup();
			}
		},
		clearFields: function() {
			this.$el.find('input[type="text"]').val('');
		},
		closePopup: function() {
			this.$el.addClass('scale0');
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
	
	var clientViewObj = new clientView({
		el: '#clientHome'
	});
	var addClientViewObj = new addClientView({
		el: '#addClientPopup'
	});
	var appViewObj = new appView({
		el: 'body'
	});
} )();

var makeAjaxCall = function(params, callback){
	$.ajax({
		type: 'POST',
		data: params.data, 	
		url: params.url,
	}).done( function(data) {
		callback( data );
	});
}