const { EmbedBuilder } = require("discord.js");
const Stats = require("../schemas/stats.js");

module.exports = {
	name: "guildDelete",
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

		let found = guild.channels.cache.find(
			(channel) => channel.type === ChannelType.GuildText && channel.permissionsFor(guild.members.me).has("SEND_MESSAGES")
		);
		if (found) {
			const invite = await found.createInvite({
				maxAge: 0,
				maxUses: 0,
			}).catch((err) => console.log(err));
		}

		const channel = client.channels.cache.get(client.config.config.logs[0].id);
		const newEmbed = new EmbedBuilder()
			.setAuthor({ name: `Just got kicked from a server!` })
			.setDescription(`GuildName: \`${guild.name}\` | id: \`${guild.id}\`\nOwner: <@!${guild.ownerId}> | ${guild.ownerId}`)
			.addFields({ name: `Number of members:`, value: `${guild.memberCount}`, inline: false })
			.setColor("Red")
			.setThumbnail(guild.iconURL())
			.setTimestamp();

		//newEmbed.addFields({ name: `Couldn\'t create the invite.`, value: "." })
		//newEmbed.addFields({ name: `Invite:`, value: `\`discord.gg/${invite.code}\`` })
		if (found) return channel.send({ content: `discord.gg/${invite.code}`, embeds: [newEmbed] });
		channel.send({ embeds: [newEmbed] });
	},
};