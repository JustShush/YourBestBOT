const { sticky } = require("../functions/sticky.js");
const { stealEmoji } = require("../functions/stealEmoji.js");

module.exports = {
	name: "messageCreate",
	execute(message, client) {
		if (client.user.id == message.author.id) return;
		sticky(message);
		if (message.author.bot) return;
		const prefix = "+";
		const args = message.content.slice(prefix.length).trim().split(/ +/);
		const command = args.shift().toLowerCase();
		if (command === 'steal') {
			stealEmoji(message, args);
		}
	},
};