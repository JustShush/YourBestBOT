const mongoose = require('mongoose');

const storeSalesSchema = new mongoose.Schema({
	GuildId: {
		type: String,
		required: true
	},
	StoreName: {
		type: String,
		required: true
	},
	TotalTickets: {
		type: Number,
		default: 0
	},
	TotalRevenue: {
		type: Number,
		default: 0
	},
	LastUpdated: {
		type: Date,
		default: Date.now
	}
});

// Create compound index for efficient queries
//storeSalesSchema.index({ GuildId: 1, StoreName: 1 }, { unique: true });

module.exports = mongoose.model('euroMilhoesStats', storeSalesSchema);