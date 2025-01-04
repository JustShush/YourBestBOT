const { EmbedBuilder, ChannelType } = require("discord.js");
const Stats = require("../schemas/stats.js");

module.exports = {
	name: "guildCreate",
	async execute(guild, client) {

		const owner = await guild.members.fetch(guild.ownerId);
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
			(channel) => channel.type === ChannelType.GuildText && channel.permissionsFor(guild.members.me).has("SEND_MESSAGES")
		);
		const comas = "704028617595682876"; // comas channel webex mas aqui
		const channel = client.channels.cache.get(comas);
		const invite = await found.createInvite({
			maxAge: 0,
			maxUses: 0,
		})
		const newEmbed = new EmbedBuilder()
			.setAuthor({ name: `Just joined a new server!` })
			.setDescription(`GuildName: \`${guild.name}\` | id: \`${guild.id}\`\nOwner: <@!${guild.ownerId}> | ${guild.ownerId}`)
			.addFields({ name: `Number of members:`, value: `${guild.memberCount}` })
			.setThumbnail(guild.iconURL())
			.setTimestamp();
		if (!invite) newEmbed.addFields({ name: `Couldn\'t create the invite.` })
		else newEmbed.addFields({ name: `Invite:`, value: `\`discord.gg/${invite.code}\`` })
		if (found) {
			//console.log(`found one: ${guild.name}`);
			channel.send({ content: `discord.gg/${invite.code}`, embeds: [newEmbed] });
		}
		else channel.send({ embeds: { newEmbed } });

		//const owner = await guild.members.fetch(guild.ownerId);
		if (!owner) return console.log("Someone added the bot but theres no owner? idk" + __filename);

		const ownerEmbed = new EmbedBuilder()
			.setColor('#0099ff')
			.setTitle('Thank You for Adding Me!')
			.setDescription(`✅Thanks for adding me to your server, ${owner.user.username}!\n**How to Use Me:**\n<:Reply:1299059023349551104> Use </commands:1222174029813776518> to see all my commands \<3`)

		owner.send({ embeds: [ownerEmbed] }).catch(err => (console.log(err, `${owner.user.username} | ${guild.ownerId} => Added the bot but the bot couldnt send the welcome DM.`), channel.send(`${owner.user.username} | ${guild.ownerId} => Added the bot but the bot couldnt send the welcome DM.`) ));

	},
};