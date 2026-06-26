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

	function normalize(text) {
		return text
		.toLowerCase()
		.replace(/0/g, "o")
		.replace(/1/g, "i")
		.replace(/3/g, "e")
		.replace(/4/g, "a")
		.replace(/5/g, "s")
		.replace(/7/g, "t");
	};

	const wordsInMessage = normalize(message.content);

	const containsProfanity = data.words.some(word => wordsInMessage.includes(normalize(word)));

	/*const containsProfanity = data.words.some(word => message.content.toLowerCase().includes(word.toLowerCase()));
*/
	const replies = [
		"Your message has been deleted for containing profanity.",
		"Mind your language! Words like that aren't allowed in this server!",
		"Message deleted! It contained a word from the blacklist."
	];
	const randReply = replies[Math.floor(Math.random() * replies.length)]

	if (containsProfanity) {
		await message.reply(
			`${message.author}, ${randReply}`
		);
		await message.delete();

		// Temp flr jogalia
		await message.member.timeout(
			15 * 60 * 1000, // 15min
			"Used a prohibited word!").catch(console.error);
	} else {
		return;
	}
}

module.exports = { WBlacklist };
