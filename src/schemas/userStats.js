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

const reqBoolean = {
	type: Boolean,
	required: true,
	defalut: false
}

module.exports = model("UserStats", new Schema({
	User: reqString,
	UserId: reqNumber,
	Avatar: String,
	Banner: String,
	Messages: reqNumber,
	CmdCount: reqNumber,
	Votes: {
		count: reqNumber,
		last: {
			type: Number,
			default: null
		}
	},
	isVoter: reqBoolean

}), "UserStats")