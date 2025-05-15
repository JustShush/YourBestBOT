const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');
module.exports = {
	name: "serverinfo",
	description: "Get information about the server",
	permission: "`SEND_MESSAGES`",
	usage: "`/serverinfo`",
	type: "Utility ⚙️",
	data: new SlashCommandBuilder()
		.setName('serverinfo')
		.setDescription('Get information about the server')
		.setContexts(0) // 0 for guild | 1 for botDM | 2 everywhere
		.setIntegrationTypes(0) // 0 for guild install | 1 for user install
		.setNSFW(false),
	async execute(interaction) {
		const guild = interaction.guild;
		const owner = await guild.fetchOwner();
		const memberCount = guild.memberCount;
		if (!guild.members.size) await guild.members.fetch();
		const onlineCount = guild.members.cache.filter(member => member.presence?.status === 'online').size;
		const idleCount = guild.members.cache.filter(member => member.presence?.status === 'idle').size;
		const dndCount = guild.members.cache.filter(member => member.presence?.status === 'dnd').size;
		const botCount = guild.members.cache.filter(member => member.user.bot).size;
		const offlineCount = memberCount - onlineCount - idleCount - dndCount;

		const channelCount = guild.channels.cache.size;
		const categoryCount = guild.channels.cache.filter(channel => channel.type === ChannelType.GuildCategory).size;
		const voiceCount = guild.channels.cache.filter(channel => channel.type === ChannelType.GuildVoice).size;
		const textCount = guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText).size;
		const announcementCount = guild.channels.cache.filter(channel => channel.type === ChannelType.GuildAnnouncement).size;
		const threadCount = guild.channels.cache.filter(channel => channel.type === ChannelType.AnnouncementThread).size;
		const thread2Count = guild.channels.cache.filter(channel => channel.type === ChannelType.PublicThread).size;
		const thread3Count = guild.channels.cache.filter(channel => channel.type === ChannelType.PrivateThread).size;
		const totalThreadCount = threadCount + thread2Count + thread3Count;
		const forumCount = guild.channels.cache.filter(channel => channel.type === ChannelType.GuildForum).size;

		const roleCount = guild.roles.cache.size;
		const roleList = guild.roles.cache
			.sort((a, b) => b.position - a.position)
			.map(role => role.toString())
			.slice(0, 20)
			.join(', ') + (roleCount > 20 ? ` and ${roleCount - 20} more...` : '');

		const boostCount = guild.premiumSubscriptionCount;
		const boostTier = guild.premiumTier;
		const createdAt = guild.createdAt;
		const explicitContentFilter = guild.explicitContentFilter === 0 ? 'Disabled' : guild.explicitContentFilter === 1 ? 'Members Without Roles' : guild.explicitContentFilter === 2 ? 'All Members' : 'Unknown';
		const defaultMessageNotifications = guild.defaultMessageNotifications === 'ALL_MESSAGES' ? 'All Messages' : 'Only @mentions';
		const mfaLevel = guild.mfaLevel === 0 ? 'Disabled' : 'Enabled';

		const bannerURL = guild.bannerURL({ format: 'png', size: 2048 });
		const splashURL = guild.splashURL({ format: 'png', size: 2048 });
		const discoverySplashURL = guild.discoverySplashURL({ format: 'png', size: 2048 });
		const iconURL = interaction.guild.iconURL();

		const banner = bannerURL ? `[Click Here for Banner](${bannerURL})` : 'Not Set';
		const splash = splashURL ? `[Click Here for Splash Image](${splashURL})` : 'Not Set';
		const discoverySplash = discoverySplashURL ? `[Click Here for Discovery Splash](${discoverySplashURL})` : 'Not Set';
		const icon = iconURL ? iconURL : 'https://github.com/JustShush/YourBestBOT/blob/1c9a6731e65ec12b0ac1ac22b3c81af14aad4fd3/assets/img/transparent.png?raw=true';
		const verificationLevelText = guild.verificationLevel === 0 ? 'None' : guild.verificationLevel === 1 ? 'Low' : guild.verificationLevel === 2 ? 'Medium' : guild.verification === 3 ? 'High' : guild.verificationLevel === 4 ? 'Very High' : 'Unknown';

		// Time formatting function
		const time = (timestamp, style) => `<t:${Math.floor(timestamp / 1000)}${style ? `:${style}` : ''}>`;

		// Create the embed
		const embed = new EmbedBuilder()
			.setColor('#2b2d32')// Discord blurple color
			.setAuthor({ name: guild.name, iconURL: `${icon}` })
			.setThumbnail(`${icon}`)
			.addFields(
				{ name: 'Insight', value: `- **Owner:** ${owner.user.tag}\n- **Created at:** ${time(createdAt, 'd')} (${time(createdAt, 'R')})\n- **Boosts:** ${boostCount} [Tier ${boostTier}]`, inline: false },
				{ name: 'Security & filters', value: `- **Explicit content filter:** ${explicitContentFilter}\n- **Default message notifications:** ${defaultMessageNotifications}\n- **Verification level:** ${verificationLevelText}\n- **2FA settings:** ${mfaLevel}`, inline: false },
				{ name: `Members [${memberCount}]`, value: `- <:online:1075135601717809173> Online: ${onlineCount}\n- <:idle:1075135563126018120> Idle: ${idleCount}\n- <:dnd:1075135660018634823> Do not disturb: ${dndCount}\n- <:offline:1075135631484784651> Offline: ${offlineCount}\n- 🤖 Bots: ${botCount}`, inline: false },
				{ name: `Channels [${channelCount}]`, value: `- **Text:** ${textCount}\n- **Voice:** ${voiceCount}\n- **Category:** ${categoryCount}\n- **Announcement:** ${announcementCount}\n- **Thread:** ${totalThreadCount}\n- **Forum:** ${forumCount}`, inline: false },
				{ name: `Roles [${roleCount}]`, value: `${roleList}`, inline: false }
			)
			.setTimestamp()
			.setFooter({ text: `Server ID: ${guild.id}` });

		// Send the embed as a reply
		await interaction.reply({ embeds: [embed] });
	},
};