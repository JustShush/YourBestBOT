const { model, Schema } = require("mongoose");

const reqString = {
	type: String,
	required: true
}

const reqNumber = {
	type: [Number],
	required: true,
	default: 0
}

const reqNumberArray = {
	type: [Number],
	required: true,
	default: 0
}

module.exports = model("EuroMilhoes", new Schema({
	GuildName: reqString,
	Guild: reqString,
	UserId: reqString,
	phoneNumber: reqNumber,
	Numeros: reqNumberArray,
	Estrelas: reqNumberArray,
	Estabelecimento: reqString,
	createdAt: { type: Date, default: Date.now },

}), "EuroMilhoes")