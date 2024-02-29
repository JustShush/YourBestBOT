const { model, Schema } = require("mongoose");

const reqString = {
	type: String,
	required: true
}

const reqNumber = {
	type: Number,
	required: true,
	default: 0
}

module.exports = model("serverConfig", new Schema({
	// detect redirect link to a msg in the server
	redirectMsg: reqNumber,
	// anti protections
	anti: {
		links: reqNumber,
		ghostPing: reqNumber,
		massMention: {
			status: reqNumber,
			threshold: {
				type: Number,
				required: true,
				default: 4
			}
		}
	}

}), "serverConfig")