// var validator = require('cloud/modules/validator.js');

var Mandrill = require('mandrill');
	Mandrill.initialize('79pLW8k1RLo6cKzxe5S7gQ');






// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("email", function(request, response) {
	Mandrill.sendEmail({
	  message: {
	    text: "What's up bitch ass $#$#!",
	    subject: "Carlitos is on fire!",
	    from_email: "papichulo@cloudcode.com",
	    from_name: "Cloud Code",
	    to: [
	      {
	        email: "kervinsvalcourt@gmail.com",
	        name: "Your Name"
	      }
	    ]
	  },
	  async: true
	},{
	  success: function(httpResponse) {
	    console.log(httpResponse);
	    response.success("Email sent!");
	  },
	  error: function(httpResponse) {
	    console.error(httpResponse);
	    response.error("Uh oh, something went wrong");
	  }
	});
});


// Parse.Cloud.beforeSave("Event", function(request, response) {
// 	if (request.object.get("foo") < 1) {
// 		response.error("you cannot give less than one star");
// 	} else if (request.object.get("foo") > 5) {
// 		response.error("you cannot give more than five stars");
// 	} else {
// 		response.error("unknow property....!!");
// 	}
// });



Parse.Cloud.beforeSave(Parse.User, function(request, response) {

		// checking username length
	var username = request.object.get('username');
		username = username.trim();
		if( username.length == 0 ){
			response.error('Missing value for username');
			request.object.set("username", username);
			return;
		}else if(username.length < 6 ){
			response.error('Username must be 6 or more characters');
			request.object.set("username", username);
			return;
		}else{
			request.object.set("username", username);
		}		


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
		


		// password must be 6 charaacters or more
	// var password = request.object.get('password');
	// 	response.error('password: '+password);
	// // 	password = password.trim();
	// // 	if( password.length == 0 ){
	// // 		response.error('Missing value for password');
	// // 		request.object.set("password", password);
	// // 		return;
	// // 	}else if(password.length < 6 ){
	// // 		response.error('Password must be 6 or more characters');
	// // 		request.object.set("password", password);
	// // 		return;
	// // 	}else{
	// // 		request.object.set("password", password);
	// // 	}



	var isLegalAge = request.object.get('legalAge');
		if(!isLegalAge){
			response.error('Must be 18 or older');
			return;	
		}

		response.success();

});