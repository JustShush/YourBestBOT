const { EmbedBuilder, ChannelType } = require("discord.js");
const Stats = require("../schemas/stats.js");

module.exports = {
	name: "guildCreate",
	async execute(guild, client) {

		let data = await Stats.findOne();
		if (!data.servers) {
			data.servers = {
				total: client.guilds.cache.size,
				current: client.guilds.cache.size,
				last: 0,
				diff: client.guilds.cache.size
			}
		} else {
			data.servers.total = client.guilds.cache.size;
			data.servers.current = data.servers.current + 1;
			data.servers.diff = data.servers.current - data.servers.last;
		}
		await data.save();

		//this sends a message to the first channel that the bot finds
		/* let found = guild.channels.cache.find((channel) => channel.type === ChannelType.GuildText && channel.permissionsFor(guild.members.me).has('SendMessages'))
		if(found) {
			found.send({ content: "welcome!"});
		} */

		let found = guild.channels.cache.find(
			(channel) => channel.type === ChannelType.GuildText && channel.permissionsFor(guild.members.me).has("SendMessages")
		);
		const comas = "704028617595682876"; // comas channel webex mas aqui
		const channel = client.channels.cache.get(comas);
		const invite = await found.createInvite({
			maxAge: 0,
			maxUses: 0,
		})
		//console.log(invite.code);
		const newEmbed = new EmbedBuilder()
			.setAuthor({ name: `Just joined a new server!` })
			.setDescription(`GuildName: \`${guild.name}\` | id: \`${guild.id}\`\nOwner: <@!${guild.ownerId}> | ${guild.ownerId}`)
			.addFields({ name: `Number of members:`, value: `${guild.memberCount}` })
			.setThumbnail(guild.iconURL())
			.setTimestamp();
		//console.log(guild)
		//console.log(guild.memberCount)
		if (!invite) newEmbed.addFields({ name: `Couldn\'t create the invite.` })
		else newEmbed.addFields({ name: `Invite:`, value: `\`discord.gg/${invite.code}\`` })
		if (found) {
			//console.log(`found one: ${guild.name}`);
			channel.send({ content: `discord.gg/${invite.code}`, embeds: [newEmbed] });
		}
		else channel.send({ embeds: {newEmbed} });
	},
};