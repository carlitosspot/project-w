// var validator = require('cloud/modules/validator.js');

// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
	response.success("Hello world!");
});


Parse.Cloud.beforeSave("Event", function(request, response) {
	if (request.object.get("foo") < 1) {
		response.error("you cannot give less than one star");
	} else if (request.object.get("foo") > 5) {
		response.error("you cannot give more than five stars");
	} else {
		response.error("unknow property....!!");
	}
});



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




		// sanitizing email
		// Note. Email uniquess is handled by Parse
	// var	email = request.object.get('email');
	// 	email = email.trim();
	// 	request.object.set("email", email.toLowerCase());


	var gender = request.object.get('gender');
		if(typeof gender === 'undefined'){
			response.error('Gender type missing');
			return;
		}else if(gender != 'f' && gender != 'm'){
			response.error('Unknown gender type given');
			return;
		}

	var birthday = request.object.get('birthday');
		if(typeof birthday === 'undefined'){
			response.error('Birthday date is missing');
			return;
		}

		response.success();

});