const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
	name: "uptime",
	data: new SlashCommandBuilder()
		.setName("uptime")
		.setDescription("Will respond with pong!"),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	execute(interaction, client) {

		let totalSeconds = (client.uptime / 1000);
		let days = Math.floor(totalSeconds / 86400);
		totalSeconds %= 86400;
		let hours = Math.floor(totalSeconds / 3600);
		totalSeconds %= 3600;
		let minutes = Math.floor(totalSeconds / 60);
		let seconds = Math.floor(totalSeconds % 60);

		let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;

		const newEmbed = new EmbedBuilder()
			.setColor('#36393F')
			.setTitle('**My Uptime:**')
			.setDescription(uptime)
		interaction.reply({ embeds: [newEmbed], ephemeral: true});
	}
}
