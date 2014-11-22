
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});


Parse.Cloud.beforeSave("TestObject", function(request, response) {
  if (request.object.get("foo") < 1) {
    response.error("you cannot give less than one star");
  } else if (request.object.get("foo") > 5) {
    response.error("you cannot give more than five stars");
  } else {
   response.error("unknow property....!");
  }
});

Parse.Cloud.beforeSave(Parse.User, function(request, response) {
   var name = request.object.get("username");
		response.error("cannot save user: "+name);
  
});