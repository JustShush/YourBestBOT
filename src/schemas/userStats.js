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

module.exports = model("UserStats", new Schema({
	User: reqString,
	UserId: reqNumber,
	Avatar: reqString,
	Banner: String,
	Messages: reqNumber,
	CmdCount: reqNumber,
	Votes: reqNumber

}), "UserStats")