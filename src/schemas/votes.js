const { model, Schema } = require("mongoose");

const reqNumber = {
	type: Number,
	required: true,
	default: 0
}

module.exports = model("Votes", new Schema({
	UserId: reqNumber,
	last: {
		type: String,
		default: null
	}

}), "Votes");