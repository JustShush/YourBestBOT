const { model, Schema } = require("mongoose");

const dBool = {
	type: Boolean,
	default: false
}

const reqString = {
	type: String,
	required: true
}

const reqNumber = {
	type: Number,
	required: true
}

module.exports = model("Giveaways", new Schema(
	{
		GuildId: {
			type: String,
			required: true,
			index: true
		},
		ChannelId: reqString,
		MessageId: reqString,
		Ended: dBool,
		Paused: dBool,
		EndTimestamp: reqNumber,
		RemainingTime: Number,
		Prize: reqString,
		Participants: [{ type: String }],
		WinnerCount: { type: Number, default: 1 },
	},
	{ timestamps: true }
), "Giveaways")