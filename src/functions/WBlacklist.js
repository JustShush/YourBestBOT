const { Message } = require('discord.js');
const filter = require('../schemas/filter.js');

/**
 * @param {Message} message
 */
async function WBlacklist(message) {
	const data = await filter.findOne({ GuildId: message.guild?.id });
	if (!data) return;
	if (data.toggle === false) return;
	if (data.immune.includes(message.author.id)) return;

	if (message.author.bot) return;

	const containsProfanity = data.words.some(word => message.content.includes(word));

	const replies = [
		"Your message has been deleted for containing profanity.",
		"Mind your language! Words like that aren't allowed in this server!",
		"Message deleted! It contained a word from the blacklist."
	];
	const randReply = replies[Math.floor(Math.random() * replies.length)]

	if (containsProfanity) {
		await message.reply(
			`${randReply}`
		);
		await message.delete();
	} else {
		return;
	}
}

module.exports = { WBlacklist };