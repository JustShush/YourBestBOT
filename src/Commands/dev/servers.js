const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
	name: "servers",
	developer: true,
	data: new SlashCommandBuilder()
		.setName("servers")
		.setDescription("Will respond with pong!")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	execute(interaction, client) {

		let serverList = '';
		client.guilds.cache.forEach(guild => {
			//server_name = `${guild.name}`;
			//server_id = `${guild.id}`;
			serverList = serverList.concat(`**${guild.name}**\n${guild.id} | **${guild.memberCount}** Members\n`);
		});

		const serversEmbed = new EmbedBuilder()
			.setTitle(
				`Every server YourBestBot is in :)` // [${client.guilds.cache.size}]
			)
			.setDescription(`In **${client.guilds.cache.size}** Servers!\nWith **${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)}** Users!\n\n${serverList}`)
			.setFooter({ text: `Requested by ${interaction.user.username} on ` + interaction.guild.name, iconURL: interaction.guild.iconURL() })
			.setTimestamp()
		interaction.reply({ embeds: [serversEmbed], ephemeral: true });
	}
}
