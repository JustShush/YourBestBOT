const { sticky } = require("../functions/sticky.js");

module.exports = {
	name: "messageCreate",
	execute(message, client) {
		if (client.user.id == message.author.id) return;
		sticky(message);
		if (message.author.bot) return;
	},
};
