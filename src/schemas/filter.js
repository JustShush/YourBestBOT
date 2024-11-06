const { model, Schema } = require("mongoose");

module.exports = model("filter", new Schema({
	GuildId: {
		type: String,
		required: true
	},
	toggle: {
		type: Boolean,
		default: false
	},
	words: {
		type: [String],
		default: [],
	},
	immune: {
		type: [String],
		default: [],
	}
}), "filter")