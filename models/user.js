var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  providerId: {type: String, default: true },
  email: String,
  providerId: String,
  created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('User', userSchema);
