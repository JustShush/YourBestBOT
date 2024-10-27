const { Message } = require('discord.js');

module.exports = {
	name: "inv",
	alias: ['getInv', 'getinv'],
	description: "Gets the invite URL to a specific guild.",
	permission: "`DEV_ONLY`",
	usage: "`inv <GUILD_ID>`",
	developer: true,
	/**
	 * @param {Message} message
	 */
	execute(message, args) {
		getInv(message, args);
	}
}

async function getInv(message, args) {
	if (message.author.id !== '453944662093332490') return message.channel.send("sorry, this command is only for the developer")
	const guild = await message.client.guilds.cache.get(args[0]);
	let found = guild.channels.cache.find(
		(channel) => channel.type === ChannelType.GuildText && channel.permissionsFor(guild.members.me).has("SendMessages")
	);
	let invites = await guild.invites.fetch().catch(err => { message.reply({ content: "couldnt fetch the invites in this server! | " + guild.name + " | " + guild.id }); return; });
	if (!invites) return;
	// Check if the bot has any invites for this server
	const botInvites = await invites.filter((invite) => invite.inviterId === message.client.user.id);
	let invite = botInvites.values().next().value;
	if (botInvites.size <= 0) {
		invite = await found.createInvite({
			maxAge: 0,
			maxUses: 0,
		}).catch(err => message.reply("couldnt create a new invite! IG Im missing perms in that server \:(", err));
	}
	const newEmbed = new EmbedBuilder()
		.setAuthor({ name: guild.name })
		.setDescription(`GuildName: \`${guild.name}\` | id: \`${guild.id}\`\nOwner: <@!${guild.ownerId}> | ${guild.ownerId}`)
		.addFields(
			{ name: `Number of members:`, value: `${guild.memberCount}` },
			{ name: `Invite:`, value: `\`discord.gg/${invite.code}\`` }
		)
		.setThumbnail(guild.iconURL())
		.setTimestamp();

	await message.reply({ content: 'discord.gg/' + invite, embeds: [newEmbed] })
}