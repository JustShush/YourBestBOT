const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const noblox = require('noblox.js');

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
		const id = await getCachedData(nick.toString(), cache.userInfo, () => noblox.getIdFromUsername(nick.toString()));
		if (!id) list = [];
		const userData = await getCachedData(id, cache.userInfo, () => noblox.getPlayerInfo({ userId: id }));
		if (!userData) list = [];
		list = [{ name: `${userData.username} (${id})`, value: id.toString() }];

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
			op = await getCachedData(op.toString(), cache.userInfo, () => noblox.getIdFromUsername(op.toString()));
		const userInfo = await getCachedData(op, cache.userInfo, () => noblox.getPlayerInfo({ userId: op }));
		if (!userInfo) return interaction.reply({ content: `Something went wrong. PLS run the comamnd again. Sorry \<3\nNo user found with the id \`${op}\``, ephemeral: true });
		const profilePic = await noblox.getPlayerThumbnail([op], '720x720', 'png', false, 'body');
		const date = new Date(userInfo.joinDate);

		const newEmbed = new EmbedBuilder()
			.setTitle(`👤 Roblox Profile: ${userInfo.username}`)
			.setURL(`https://www.roblox.com/users/${op}/profile`)
			.setColor('#2B2D31')
			.setThumbnail(profilePic[0].imageUrl)
			.addFields(
				{ name: '✨ Username', value: userInfo.username, inline: true },
				{ name: '📛 Display Name', value: userInfo.displayName, inline: true },
				{ name: '🆔 User ID', value: op.toString(), inline: true },
				{ name: '📝 Description', value: userInfo.blurb || 'No description', inline: false },
				{ name: '💬 Status', value: userInfo.status || 'No status', inline: false },
				{ name: '👥 Friends Count', value: userInfo.friendCount.toString(), inline: true },
				{ name: '👀 Followers Count', value: userInfo.followerCount.toString(), inline: true },
				{ name: '🔄 Following Count', value: userInfo.followingCount.toString(), inline: true },
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
		const userId = await getCachedData(focusedValue.toString(), cache.userInfo, () => noblox.getIdFromUsername(focusedValue.toString()));
		if (!userId) return;
		const userData = await getCachedData(userId, cache.userInfo, () => noblox.getPlayerInfo({ userId: userId }));
		if (!userData) return;
		return { name: `${userData.username} (${userId})`, value: userId.toString() };
	}
	const userData = await getCachedData(focusedValue, cache.userInfo, () => noblox.getPlayerInfo({ userId: focusedValue }));
	if (!userData) return;
	return { name: `${userData.username} (${focusedValue})`, value: focusedValue.toString() };
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