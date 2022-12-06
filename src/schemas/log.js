const { model, Schema } = require("mongoose");

module.exports = model("Logs", new Schema({
	Guild: String,
	User: String,
	UserTag: String,
	Channel: String
}), "Logs")