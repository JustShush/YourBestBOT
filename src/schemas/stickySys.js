const { model, Schema } = require("mongoose");

const reqString = {
	type: String,
	required: true
}

module.exports = model("stickySys", new Schema({
	GuildName: String,
	GuildId: reqString,
	User: String,
	UserTag: String,
	stickys : [{
		ChannelID: reqString,
		MSG: reqString,
		MSGID: reqString,
	}],
	Max: {
		type: Number,
		required: true,
		default: 5
	},
	Current: {
		type: Number,
		required: true,
		default: 0
	},

}), "stickySys")