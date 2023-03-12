const { model, Schema } = require("mongoose");

module.exports = model("nicksys", new Schema({
	GuildName: String,
	Guild: String,
	User: String,
	UserTag: String,
	Nicksys: Boolean,

}), "nicksys")