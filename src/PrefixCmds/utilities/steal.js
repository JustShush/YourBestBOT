const { Message } = require('discord.js');
const { stealEmoji } = require('../../functions/stealEmoji.js');

module.exports = {
	name: "steal",
	description: "Copy an emoji to the current server.",
	permission: "`MANAGE_GUILD_EXPRESSIONS`",
	usage: "`steal`",
	type: "Utility",
	/**
	 * @param {Message} message
	 */
	execute(message, args) {
		if (!(message.member.permissions.has(PermissionFlagsBits.ManageGuildExpressions))) return message.channel.send({ content: `You don't have the required permissions to run this command.` }).then((msg) => { setTimeout(() => { msg.delete(); }, 5 * 1000); })
		stealEmoji(message, args);
	}
}
