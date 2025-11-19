const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const Stats = require("../schemas/stats.js");

module.exports = {
	name: "guildDelete",
	async execute(guild, client) {
		let owner = await guild.members.cache.get(guild.ownerId);
		if (!owner) owner = await client.users.fetch(guild.ownerId);
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

		//const owner = await guild.members.fetch(guild.ownerId);
		if (!owner) return console.log("Someone removed the bot but theres no owner? idk" + __filename); // I think this never happaned but i will still leave it here

		const ownerEmbed = new EmbedBuilder()
			.setColor('#ff0000')
			.setDescription(`❌ I was removed from \`${guild.name}\`.\n# KICKED ME BY MISTAKE?\nPress the button below to add me again \<3. [Add Me](https://yourbestbot.pt/invite).`);

		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setLabel("Vote for YourBestBOT")
					.setEmoji('❤️')
					.setURL(`https://yourbestbot.pt/vote`)
					.setStyle(ButtonStyle.Link),
				new ButtonBuilder()
					.setLabel(`Add YourBestBOT`)
					.setEmoji("🔗")
					.setURL('https://yourbestbot.pt/invite')
					.setStyle(ButtonStyle.Link),
			);

		if (!guild.ownerId) {
			await rmSavedGuildDataFromAll(guild);
			return channel.send({ content: `Left guild: ${guild.name}, but no ownerId available`});
		}
		owner.send({ content: `${owner.user}`, embeds: [ownerEmbed], components: [row] }).catch(err => (console.log(err, `${owner.user.username} | ${guild.ownerId} => Removed the bot but the bot couldnt send the GoodBye DM.`), channel.send(`${owner.user.username} | ${guild.ownerId} => Removed the bot but the bot couldnt send the GoodBye DM.`)));

		// delete all saved data from that guild
		await rmSavedGuildDataFromAll(guild);
	},
};