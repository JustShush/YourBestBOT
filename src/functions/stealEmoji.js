const { Message } = require("discord.js");

/**
 * Creates a new emoji in the current server.
 * @param {Message} message
 * @param {String[]} args user intput
 */
function stealEmoji(message, args) {
	if (!args) return message.reply({ content: "Please specify some emojis." });
	const regex = /<a?:([a-zA-Z0-9_]+):(\d+)>/;
	const match = args[0].match(regex);

	if (match) {
		const ename = match[1];
		const id = match[2];
		//console.log(ename, id);
		const extention = args[0].includes("<a:") ? ".gif" : ".png";
		const url = `https://cdn.discordapp.com/emojis/${id + extention}`;
		message.guild.emojis.create({ attachment: url, name: ename })
			.then((emoji) => message.channel.send({ content: `Added: \`${emoji.imageURL()}\` ${emoji} ` }));
	} else {
		console.log("there was a problem")
	}
}

module.exports = { stealEmoji };