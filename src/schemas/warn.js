const { model, Schema } = require("mongoose");

module.exports = model("Warns", new Schema({
	Guild: String,
	User: String,
	UserTag: String,
	Warns: Array
}), "Warns")