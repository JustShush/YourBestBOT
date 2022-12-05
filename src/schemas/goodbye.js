const { model, Schema } = require("mongoose");

module.exports = model("GoodBye", new Schema({
	GuildName: String,
	Guild: String,
	Channel: String,
	MSG: String,
}), "GoodBye")