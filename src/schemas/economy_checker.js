const { model, Schema } = require("mongoose");

module.exports = model("economy_checker", new Schema({
	GuildName: String,
	Guild: String,
	User: String,
	UserTag: String,
	Profession: Number,
	balance: {
		type: Number,
		default: 0
	},
	inventory: Array,
	ask_cooldown: {
		type: Number,
		default: 0
	},
	work_cooldown: {
		type: Number,
		default: 0
	},
	search_cooldown: {
		type: Number,
		default: 0
	},
	daily_cooldown: {
		type: Number,
		default: 0
	},
	daily_streak: {
		type: Number,
		default: 0
	},
	daily_last_claimed: {
		type: Number,
		default: 0
	},
	claimed_level_5: Boolean,
	claimed_level_10: Boolean,
	claimed_level_20: Boolean,
	claimed_level_30: Boolean,
	claimed_level_40: Boolean,
	claimed_level_50: Boolean,
	claimed_level_75: Boolean,
	claimed_level_100: Boolean,

}), "economy_checker")