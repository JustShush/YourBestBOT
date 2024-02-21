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

module.exports = model("stats", new Schema({
	// number of messages sent that the bot listened
	NMessages: reqNumber,
	// number of command used
	NUsedCmd: reqNumber,

}), "stats")