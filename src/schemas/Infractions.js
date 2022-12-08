const { model, Schema } = require("mongoose");

module.exports = model("Infractions", new Schema({
	GuildName: String,
	Guild: String,
	User: String,
	UserTag: String,
	Infractions: Array
}), "Infractions")