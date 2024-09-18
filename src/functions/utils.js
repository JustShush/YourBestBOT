const { Integration, EmbedBuilder, Message, Client } = require("discord.js");
const axios = require("axios");

/**
 * Check if 2 random numbers are the same.
 * 
 * This is good for testing your luck.
 * @returns 1 if true.
 */
const randomN = function number() {
	const random_number1 = Math.floor(Math.random() * 200);
	const random_number2 = Math.floor(Math.random() * 200);

	if (random_number1 === random_number2)
		return 1;
	return 0;
}

/**
 * Check if 2 random numbers are the same.
 * 
 * This is good for testing your luck.
 * @param {Number} range The range of the random numbers
 * @returns 1 if true.
 */
const randomNRange = function number(range) {
	if (isNaN(range)) return 0;
	const random_number1 = Math.floor(Math.random() * range);
	const random_number2 = Math.floor(Math.random() * range);

	if (random_number1 === random_number2)
		return 1;
	return 0;
}

/**
 * Sends and Ad Embed to the current interaction channel.
 * @param {Message} message Command interaction
 */
async function ADMessage(message) {

	const newEmbed = new EmbedBuilder()
		.setDescription(`## ❤️ Hope your are enjoying your experience with me ❤️\nMaybe consider adding [me](https://yourbestbot.pt/invite) to your server.`)
		.setFooter({ text: `With a lot of ❤️ YBB Dev's ❤️` })
		.setTimestamp()

	await message.channel.send({ embeds: [newEmbed] });
}

/**
 * Sends and Ad Embed to the current interaction channel.
 * @param {Integration} interaction Command interaction
 * @param {Boolean} ephemeral
 */
async function AD(interaction, ephemeral) {

	const newEmbed = new EmbedBuilder()
		.setDescription(`## ❤️ Hope your are enjoying your experience with me ❤️\nMaybe consider checking all the new an improved premium features at [YourBestBot Premium](https://yourbestbot.pt)`)
		.setFooter({ text: `With a lot of ❤️ YBB Dev's ❤️` })
		.setTimestamp()

	await interaction.followUp({ embeds: [newEmbed], ephemeral: ephemeral ? true : false });
}

/**
 * Function to get the top x servers with the most members along with some of their information
 * @param {Client} client discord client
 * @param {Number} nbr the number of servers to return
 * @returns an Array with the TOP <nbr> servers along with some of their info
 */
async function getTopServers(client, nbr) {
	if (isNaN(nbr)) return [];
	const guilds = await client.guilds.fetch(); // Fetch all guilds the bot is in
	const sortedGuilds = guilds.cache.sort((a, b) => b.memberCount - a.memberCount).first(nbr); // Sort guilds by member count and get the top 10

	const topServers = sortedGuilds.map(guild => {
		return {
			name: guild.name,
			memberCount: guild.memberCount
		};
	});

	return topServers;
}

function getTimestamp() {
	const date = new Date();
	const year = date.getUTCFullYear();
	const month = date.getUTCMonth() + 1;
	const day = date.getUTCDate();
	const hours = date.getUTCHours() + 1;
	const minutes = date.getUTCMinutes();
	const seconds = date.getUTCSeconds();
	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Sends a WebHook to a specific channel with the input msg
 * @param {String} msg The message to send
 */
async function INFO(msg) {
	const wh = "https://discord.com/api/webhooks/1274752856448303157/U4Yd_w46FgPRvilXO4YhYGPEUa1n-cuG5tWYu_h94H7AMI8vcxtvghYcsvURJ4Cj8vLg";

	const data = {
		content: msg + ' ' + __filename,
		username: 'YBB INFO',
		//avatar_url: ''
	}

	// send the msg
	await axios.post(wh, data).then((res) => console.log(res.data)).catch((err) => console.log(err));

}

module.exports = { randomN, randomNRange, AD, ADMessage, getTopServers, getTimestamp , INFO };