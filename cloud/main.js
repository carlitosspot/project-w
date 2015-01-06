// var validator = require('cloud/modules/validator.js');

var Mandrill = require('mandrill');
	Mandrill.initialize('79pLW8k1RLo6cKzxe5S7gQ');

var Stripe = require('stripe');
	Stripe.initialize('sk_test_5d5lDT1fJGpTNShVZLFuqncy');



Parse.Cloud.define("sendPayout", function(request, response){

	var user = Parse.User.current();
		if(!user)
			response.error('Uknown user');


	var amount	= request.params.amount;


		 // -----validate amount --------
	if(typeof amount === 'undefined'){
		response.error('amount is missing');
		return;
	}

	amount = parseFloat(amount);
	if( amount <= 0 ){
		request.params.amount = amount;
		response.error('Invalid amount');
		return;
	}

    Parse.Cloud.httpRequest({
		url: 'http://paypal-app-api.herokuapp.com/api/payout',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body: {amount: amount},
		success: function(httpResponse) {
			response.success(httpResponse.text);
		},
		error: function(httpResponse) {
			response.error(httpResponse);
		}
	});

});







Parse.Cloud.define("chargeCard", function(request, response) {

	var token 	= request.params.token;
	var amount	= request.params.amount;

	  // -----validate token --------
	if(typeof token === 'undefined'){
		response.error('token is missing');
		return;
	}else if(token.length == 0 ){
		request.params.token = token;
		response.error('Invalid token');
		return;
	}
	

	  // -----validate amount --------
	if(typeof amount === 'undefined'){
		response.error('amount is missing');
		return;
	}else if( amount <= 0 ){
		request.params.amount = amount;
		response.error('Invalid amount');
		return;
	}
	

	Stripe.Charges.create({
		amount: amount, 
	  	currency: "usd",
	  	card: token 
	},{
	  success: function(httpResponse) {
	    response.success("Charge complete");
	  },
	  error: function(httpResponse) {
	    response.error("Unable to charge credit card"+httpResponse.message);
	  }
	});
});











Parse.Cloud.define("sendWelcomeEmail", function(request, response) {

	var user = Parse.User.current();
		if(!user)
			response.error('No logged in user');

		Mandrill.sendEmail({
		  message: {
		    text: "Welcome to NoName. Make a move and you could see some $$ or $$$ added to your bank account.",
		    subject: "Welcome to NoName",
		    from_email: user.getEmail(),
		    from_name: "NoName App",
		    to: [
		      {
		        email: user.getEmail(),
		        name: user.get('fullName')
		      }
		    ]
		  },
		  async: true
		},{
		  success: function(httpResponse) {
		    //console.log(httpResponse);
		    response.success("Email sent!");
		  },
		  error: function(httpResponse) {
		    // console.error(httpResponse);
		    response.error("Uh oh, unable to send welcome email");
		  }
		});
});






Parse.Cloud.beforeSave(Parse.User, function(request, response) {

		// checking username length
	// var username = request.object.get('username');
	// 	username = username.trim();
	// 	if( username.length == 0 ){
	// 		response.error('Missing value for username');
	// 		request.object.set("username", username);
	// 		return;
	// 	}else if(username.length < 6 ){
	// 		response.error('Username must be 6 or more characters');
	// 		request.object.set("username", username);
	// 		return;
	// 	}else{
	// 		request.object.set("username", username);
	// 	}		


			// checking username length
	var fullName = request.object.get('fullName');
		if(typeof fullName === 'undefined'){
			response.error('Full name is required');
			return;
		}

		fullName = fullName.trim();
		if( fullName.length == 0 ){
			response.error('Missing full name');
			request.object.set("fullName", fullName);
			return;
		}else if(fullName.length < 4 ){
			response.error('Invalid full name');
			request.object.set("fullName", fullName);
			return;
		}else{
			request.object.set("fullName", fullName);
		}	


			// ---- email
	var email = request.object.get('email');
		if(typeof email === 'undefined'){
			response.error('email is required');
			return;
		}

		email = email.trim();
		if( email.length == 0 ){
			response.error('Missing email');
			request.object.set("email", email);
			return;
		}


		// ---- legal age
	// var isLegalAge = request.object.get('legalAge');
	// 	if(!isLegalAge){
	// 		response.error('Must be 18 or older');
	// 		return;	
	// 	}

		response.success();
});