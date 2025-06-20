const { model, Schema } = require("mongoose");

const reqString = {
	type: String,
	required: true
}

module.exports = model("Tickets", new Schema({
	GuildId: {
		type: String,
		required: true,
		index: true
	},
	CategoryId: reqString,
	StaffRoles: [],
	Tickets: [{
		MemberId: reqString,
		ChannelId: reqString,
	}],
	TicketId: {
		type: String,
		required: true
	}
}), "Tickets")