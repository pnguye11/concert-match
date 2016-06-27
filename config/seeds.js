var mongoose = require('mongoose');
require('dotenv').load();

var User = require('../models/user');

var users = [
{
  name : "Phuong Nguyen",
  email: "turtl_unit_24@yahoo.com",
  providerId: "57719a5cdefdcc9508b63f1e",
  images: "https://i.ytimg.com/vi/e-ORhEE9VVg/maxresdefault.jpg"
}];

User.remove({}, function(err) {
  console.log(err)
});

mongoose.connection.close();
