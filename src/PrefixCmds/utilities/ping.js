const { Message } = require('discord.js');

module.exports = {
	name: "ping",
	description: "Ping the bot to see if it's alive.",
	permission: "`SEND_MESSAGES`",
	usage: "`ping`",
	type: "Utility",
	/**
	 * @param {Message} message
	 */
	execute(message, args) {
		message.channel.send({ content: "Pong!" });
	}
}
