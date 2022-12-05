const { model, Schema } = require("mongoose");

module.exports = model("Welcome", new Schema({
	GuildName: String,
	Guild: String,
	User: String,
	UserTag: String,
	Channel: String,
	MSG: String,
	Role: String
}), "Welcome")