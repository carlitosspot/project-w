// var validator = require('cloud/modules/validator.js');

var Mandrill = require('mandrill');
	Mandrill.initialize('79pLW8k1RLo6cKzxe5S7gQ');

var Stripe = require('stripe');
	Stripe.initialize('sk_test_5d5lDT1fJGpTNShVZLFuqncy');



Parse.Cloud.define("userTest", function(request, response){
	var userId = request.params.userId;
  	var query = new Parse.Query(Parse.User);
      	query.equalTo("objectId", userId);
      	query.first({
        success: function(User) {
          	//alert("Successfully retrieved " + results.length + " scores.");
            console.log(results)
        },
        error: function(error) {
          	alert("Error: " + error.code + " " + error.message);
        }
    });
});




// setting up a business
Parse.Cloud.beforeSave('Business', function(request, response){


});



// get list of  buisnesses

Parse.Cloud.define("businesses", function(request, response){  
	var user = Parse.User.current();
		if(!user)
			response.error('No logged in user');

		
	var result = {name: 'hello there', pictures:['some url 1', 'some url 2']};
	response.success(result);


});



Parse.Cloud.define("sendPayout", function(request, response){

	var user = Parse.User.current();
		if(!user)
			response.error('Uknown logged in user');


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


		// ---validate user Id ----------

	var userId	= request.params.userId;
	var worker 	= null;
	if(typeof userId === 'undefined' ){
		response.error('mising user id to be paid');
		return;
	}

	var query = new Parse.Query(Parse.User);
      	query.equalTo("objectId", userId);
      	query.first({
        success: function(u) {
        	if(typeof u === 'undefined'){
        		response.error('unable to find user: '+userId);
          		return;
        	}else{
				worker = u;

				// 
				//  pay worker.......
			    Parse.Cloud.httpRequest({
					url: 'http://paypal-app-api.herokuapp.com/api/payout',
					method: 'POST',
					headers: {
						'Content-Type': 'application/json;charset=utf-8'
					},
					body: {amount: amount, email: worker.getEmail()},
					success: function(httpResponse) {
						response.success(httpResponse.text);
					},
					error: function(httpResponse) {
						response.error(httpResponse);
					}
				});
        	}
        		
        },
        error: function(error) {
          	response.error(error.message);
          	return;
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


	// since save is executed on create and update.,
	// the validators should only run on update or when the data source is not fb/twitter on create

	// check data source
	var dataSource = request.object.get('social');
	if ( typeof dataSource !== 'undefined' && dataSource === 'N') {
		// Data is coming from user. Execute validators

			// validate first name
		var firstName = request.object.get('firstName');
			if(typeof firstName === 'undefined'){
				response.error('First name is required');
				return;
			}

			firstName = firstName.trim();
			if( firstName.length == 0 ){
				response.error('Missing first name');
				request.object.set("firstName", firstName);
				return;
			}else if(firstName.length < 2 ){
				response.error('Invalid first name');
				request.object.set("firstName", firstName);
				return;
			}else{
				request.object.set("firstName", firstName);
			}	



			// validate first name
		var lastName = request.object.get('lastName');
			if(typeof lastName === 'undefined'){
				response.error('Last name is required');
				return;
			}

			lastName = lastName.trim();
			if( lastName.length == 0 ){
				response.error('Missing last name');
				request.object.set("lastName", lastName);
				return;
			}else if(lastName.length < 2 ){
				response.error('Invalid last name');
				request.object.set("last", lastName);
				return;
			}else{
				request.object.set("lastName", lastName);
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

			response.success();
	};

	response.success();
	
});