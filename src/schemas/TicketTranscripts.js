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
			content: String,
			timestamp: Date,
		},
	],
}), "TTranscripts")