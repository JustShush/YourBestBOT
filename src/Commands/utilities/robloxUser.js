const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const noblox = require('noblox.js');
const axios = require('axios');

const cache = {
	userInfo: new Map(),
	profilePic: new Map()
};

module.exports = {
	name: "getinfo",
	description: "Retrieve the Roblox information of a user.",
	type: "Utility",
	subcommand: false,
	permissions: "UseApplicationCommands",
	data: new SlashCommandBuilder()
		.setName('getinfo')
		.setDescription('Retrieve the Roblox information of a user.')
		.setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands)
		.addStringOption(o =>
			o.setName('roblox_name')
				.setDescription('Please enter a Roblox username or Roblox ID.')
				.setRequired(true)
				.setAutocomplete(true)
		)
		.setContexts(0)
		.setIntegrationTypes(0),
	async autocomplete(interaction) {

		const focusedValue = interaction.options.getFocused();

		const nick = interaction.member.displayName;

		let list = [];
		const id = await getCachedData(nick.toString(), cache.userInfo, () => getDataByUsername(nick.toString()));
		if (!id) list = [];
		let userData;
		if (id) userData = await getCachedData(id, cache.userInfo, () => getDataById(id));
		if (!userData) list = [];
		else
			list = [{ name: `${userData.name} (${id})`, value: id.toString() }];

		if (focusedValue && focusedValue.length > 2) {
			const info = await getInfo(focusedValue);
			if (info) list = [info];
		}

		void interaction.respond(
			list.slice(0, 25)
		);
	},
	async execute(interaction) {
		console.log(cache);
		const { options } = interaction;
		let op = options.getString("roblox_name");

		if (isNaN(op))
			op = await getCachedData(op.toString(), cache.userInfo, () => getDataByUsername(op.toString()));
		const userInfo = await getCachedData(op, cache.userInfo, () => getDataById(op));
		if (!userInfo) return interaction.reply({ content: `Something went wrong. PLS run the comamnd again. Sorry \<3\nNo user found with the id \`${op}\``, ephemeral: true });
		const profilePic = await noblox.getPlayerThumbnail([op], '720x720', 'png', false, 'body');
		const date = new Date(userInfo.created);

		const newEmbed = new EmbedBuilder()
			.setTitle(`👤 Roblox Profile: ${userInfo.name}`)
			.setURL(`https://www.roblox.com/users/${op}/profile`)
			.setColor('#2B2D31')
			.setThumbnail(profilePic[0].imageUrl)
			.addFields(
				{ name: '✨ Username', value: userInfo.name, inline: true },
				{ name: '📛 Display Name', value: userInfo.displayName, inline: true },
				{ name: '🆔 User ID', value: op.toString(), inline: true },
				{ name: '📝 Description', value: userInfo.description || 'No description', inline: false },
				{ name: '📅 Account Age', value: convertDays(userInfo.age), inline: true },
				{ name: '📆 Join Date', value: `<t:${Math.floor(date.getTime() / 1000)}:R>`, inline: true }
			)

		const row = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setLabel('🔗 View Profile')
				.setURL(`https://www.roblox.com/users/${op}/profile`)
				.setStyle(ButtonStyle.Link)
		);

		return interaction.reply({ embeds: [newEmbed], components: [row] });
	}
}

// Function to retrieve from cache or fetch and store in cache
async function getCachedData(key, cacheMap, fetchFunction, cacheDuration = 6 * 60 * 60 * 1000) { // Default: 6 Hours
	const cached = cacheMap.get(key);
	const now = Date.now();

	if (cached && (now - cached.timestamp < cacheDuration))
		return cached.data;

	const data = await fetchFunction();
	if (!data) return null;
	cacheMap.set(key, { data, timestamp: now });
	return data;
}

async function getInfo(focusedValue) {
	if (isNaN(focusedValue)) {
		const userId = await getCachedData(focusedValue.toString(), cache.userInfo, () => getDataByUsername(focusedValue.toString()));
		if (!userId) return;
		const userData = await getCachedData(userId, cache.userInfo, () => getDataById(userId));
		if (!userData) return;
		return { name: `${userData.name} (${userId})`, value: userId.toString() };
	}
	const userData = await getCachedData(focusedValue, cache.userInfo, () => getDataById(focusedValue));
	if (!userData) return;
	return { name: `${userData.name} (${focusedValue})`, value: focusedValue.toString() };
}

function convertDays(days) {
	const years = Math.floor(days / 365);
	const months = Math.floor((days % 365) / 30);
	const remainingDays = days % 365 % 30;

	let result = '';

	if (years > 1)
		result += `${years} years, `;

	result += `${months} months, and ${remainingDays} days.`;
	return result;
}

async function getDataByUsername(name) {
	try {
		const response = await axios.post(`https://users.roblox.com/v1/usernames/users`, {
			"usernames": [name],
			"excludeBannedUsers": true
		})
		//console.log('username:', response.data.data);
		const data = response.data.data[0];
		return data.id
	}
	catch (err) { return }
}

async function getDataById(userId) {
	try {
		// Make a request to fetch user information by user ID
		const res = await axios.get(`https://users.roblox.com/v1/users/${userId}`);

		// Return user data
		//console.log('id:', res.data);

		const data = res.data;

		// Calculate account age
		const accountCreatedDate = new Date(res.data.created);
		const currentDate = new Date();
		const accountAgeInDays = Math.floor((currentDate - accountCreatedDate) / (1000 * 60 * 60 * 24));
		data.age = accountAgeInDays;

		// this is commented because it returns "error 429 too many requests"
		/* // Fetch follower count using the user ID
		const followerCountResponse = await axios.get(`https://friends.roblox.com/v1/users/${userId}/followers/count`);

		// Check if responses are successful
		if (!followerCountResponse.data || followerCountResponse.data.error)
			throw new Error("Failed to fetch follower count");
		const followerCount = followerCountResponse.data.count;
		data.followerCount = followerCount;

		// Fetch following count using the user ID
		const followingCountResponse = await axios.get(`https://friends.roblox.com/v1/users/${userId}/followings/count`);
		if (!followingCountResponse.data || followingCountResponse.data.error)
			throw new Error("Failed to fetch following count");

		const followingCount = followingCountResponse.data.count;
		data.followingCount = followingCount; */

		// console.log(data)
		return data;
	} catch (error) {
		console.log(error)
		console.error("Error fetching user data:", error.message);
		return { error: "Failed to fetch user data" };
	}
}