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

// maybe make a stat for like how many
// new server added the bot per day/week/month
// same with users?
// votes only per month ✅ done i think ✅
module.exports = model("stats", new Schema({
	// number of messages sent that the bot listened
	NMessages: reqNumber,
	// number of command used
	NUsedCmd: reqNumber,
	// arr of all the commands
	cmds: [{
		name: reqString,
		type: reqString,
		uses: {
			type: Number,
			default: 0
		}
	}],
	// number of votes per month
	votes: {
		total: reqNumber,
		current: reqNumber,
		last: reqNumber,
		diff: reqNumber
	}

}), "stats")