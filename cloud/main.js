var greetings = require('cloud/modules/greetings.js');

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
	response.error('hello there!');
	 // response.error(greetings.sayHelloInEnglish());
	// var require = function(name, request){
	// 				if( !request.object.get(name)  && request.object.get(name).length <= 0 )
	// 					return 'Missing value for '+ name;
	// 				return '';
	// 			};

	// var email = request.object.get("email");
	// 	request.object.set("email", email.toLowerCase());

	// var query = new Parse.Query(Parse.User);
	//     query.equalTo('username', request.object.get("username"));
	//     query.equalTo('email', request.object.get("email"));
	// 	query.find({
	// 	  success: function(results) {
	// 	    // response.error(greetings.sayHelloInEnglish());
	// 	  },

	// 	  error: function(error) {
	// 	    //response.error('Username: '+request.object.get('username')+' is already being used');
	// 	    response.error(greetings.sayHelloInEnglish());
	// 	  }
	// 	});

	// var name = request.object.get("username");
	// response.error("cannot save user: "+name);

});