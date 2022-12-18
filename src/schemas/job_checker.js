const { model, Schema } = require("mongoose");

module.exports = model("job_checker", new Schema({
	GuildName: String,
	Guild: String,
	User: String,
	UserTag: String,
	Jobs: Array,

}), "job_checker")