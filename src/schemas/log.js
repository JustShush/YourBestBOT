const { model, Schema } = require("mongoose");

module.exports = model("Logs", new Schema({
	GuildName: String,
	Guild: String,
	UserId: String,
	UserTag: String,
	General: {
		id: String,
		webhookId: String
	}
}), "Logs")