const { model, Schema } = require("mongoose");

const reqNumber = {
	type: Boolean,
	required: true,
	default: 0
}

module.exports = model("euroMilhoesToggle", new Schema({
	status: reqNumber,
	createdAt: { type: Date, default: Date.now },

}), "euroMilhoesToggle")