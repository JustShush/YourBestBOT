const { model, Schema } = require("mongoose");

module.exports = model("economy_checker", new Schema({
	GuildName: String,
	Guild: String,
	User: String,
	UserTag: String,
	balance: Number,
	inventory: Array,
	ask_cooldown: Number,
	search_cooldown: Number,
	daily_cooldown: Number,
	daily_streak: Number,
	daily_last_claimed: Number,
	claimed_level_5: Boolean,
	claimed_level_10: Boolean,
	claimed_level_20: Boolean,
	claimed_level_30: Boolean,
	claimed_level_40: Boolean,
	claimed_level_50: Boolean,
	claimed_level_75: Boolean,
	claimed_level_100: Boolean,

}), "economy_checker")