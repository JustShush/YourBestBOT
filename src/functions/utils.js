const { Integration, EmbedBuilder, Message, Client } = require("discord.js");
const axios = require("axios");
const fs = require('fs');

function embedColor() {
	// random colors from one dark color palette 
	const colors = ['#282C34', '#E06C75', '#98C379', '#E5C07b', '#61AFEF', '#C678DD', '#56B6C2', '#ABB2BF', '#6B859E', '#3890E9', '#A359ED', '#EC5252', '#C97016', '#5DA713', '#13AFAF'];
	const color = Math.floor(Math.random() * colors.length);
	const resColor = colors[color];
	return resColor;
	// end of the color randomization
}

/**
 * This just displays a simple progress bar as a string.
 * 
 * - example on how to use it to show 50% : console.log( ProgressBar(50, 100) ) // 50%
 * - result for 10%: [ ⣷		 ] 10%
 * 
 * @param {Number} progress The current progress
 * @param {Number} max The max progress percentage
 * @returns A string with the progress bar.
 */
function ProgressBar(progress, max) {
	const PROGRESS = [' ', '⡀', '⣀', '⣄', '⣤', '⣦', '⣶', '⣷', '⣿'];
	if (progress > max) progress = max;

	const percent = Math.floor((progress / max) * 100);
	const full = Math.floor((progress / max) * PROGRESS.length);
	const remainder = Math.floor(((progress / max) * PROGRESS.length - full) * 8);
	const bar = `${PROGRESS[PROGRESS.length - 1].repeat(full)}${PROGRESS[remainder]}${' '.repeat(PROGRESS.length - full)}`;
	return `[ ${bar}] ${percent}%`;
}

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

function parseDuration(duration) {
	const regex = /^(\d+)(ms|s|d|w)$/;
	const match = duration.match(regex);

	if (!match)
		throw new Error('Invalid duration format');

	const value = parseInt(match[1]);
	const unit = match[2];

	switch (unit) {
		case 'ms':
			return value;
		case 's':
			return value * 1000;
		case 'd':
			return value * 1000 * 60 * 60 * 24;
		case 'w':
			return value * 1000 * 60 * 60 * 24 * 7;
		default:
			throw new Error('Invalid duration unit');
	}
}

/**
 * Sends a WebHook to a specific channel with the input msg
 * @param {String} msg The message to send
 */
async function INFO(msg) {
	const wh = "https://discord.com/api/webhooks/1327055246026997893/Uiyw9TSH7QM-c4RC5z8Nhpa7JZrcIOWq6Gc1FP2CRrQxK1UbYzbYqJqdF8h64BOi-ylD";

	const data = {
		content: msg + ' ' + __filename,
		username: 'YBB INFO',
		//avatar_url: ''
	}

	// send the msg
	await axios.post(wh, data).then((res) => console.log(res.data)).catch((err) => console.log(err));
}

function saveCacheToFile(cache) {
	console.log('Type of cache:', typeof cache);
	console.log('Instance of Map:', cache instanceof Object);
	console.log('Cache contents:', cache);
	fs.writeFileSync('cache.json', JSON.stringify(cache, null, 2), 'utf8');
}

function loadCacheFromFile(filename) {
	let cache = {};
	if (fs.existsSync(filename)) {
		const data = JSON.parse(fs.readFileSync(filename, 'utf8'));
		Object.keys(data).forEach((key) => {
			if (Array.isArray(data[key]) && data[key].length === 0)
				delete data[key];
		})
		cache = data;
	}
	return cache;
}

module.exports = { embedColor, ProgressBar, randomN, randomNRange, ADMessage, AD, getTopServers, getTimestamp, parseDuration, INFO, saveCacheToFile, loadCacheFromFile };
