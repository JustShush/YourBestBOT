const { model, Schema } = require("mongoose");

const reqString = {
	type: String,
	required: true
}

module.exports = model("TTranscripts", new Schema({
	ticketId: { type: String, required: true, unique: true },
	messages: [
		{
			author: reqString,
			avatar: {
				type: String,
				default: 'https://cdn.discordapp.com/embed/avatars/0.png'
			},
			content: String,
			timestamp: Date,
		},
	],
	createdAt: { type: Date, default: Date.now }, // Automatically set to current date
}), "TTranscripts")