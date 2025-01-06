const { model, Schema } = require("mongoose");

const reqString = {
	type: String,
	required: true
}

module.exports = model("TTranscripts", new Schema({
	ticketId: { type: String, required: true, unique: true },
	messages: [
		{
			id: String,
			author: reqString,
			avatar: {
				type: String,
				default: 'https://cdn.discordapp.com/embed/avatars/0.png'
			},
			content: String,
			reference: String,
			attachments: [String],
			guildIcon: {
				type: String,
				default: 'https://cdn.discordapp.com/embed/avatars/0.png'
			},
			timestamp: String,
		},
	],
	createdAt: { type: Date, default: Date.now }, // Automatically set to current date
}), "TTranscripts")