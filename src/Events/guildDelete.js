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
			data.servers.diff = data.servers.current - last;
		}
		await data.save();

		const channel = client.channels.cache.get(client.config.logs[0].id);
		const newEmbed = new EmbedBuilder()
			.setAuthor({ name: `Just got kicked from a server!` })
			.setDescription(`GuildName: \`${guild.name}\` | id: \`${guild.id}\`\nOwner: <@!${guild.ownerId}> | ${guild.ownerId}`)
			.addFields({ name: `Number of members:`, value: `${guild.memberCount}` })
			.setColor("Red")
			.setThumbnail(guild.iconURL())
			.setTimestamp();
		channel.send({ embeds: [newEmbed] });
	},
};