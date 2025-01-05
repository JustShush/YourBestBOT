const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
	name: "uptime",
	description: "Check bot's uptime.",
	permission: "`SEND_MESSAGES`",
	usage: "`/uptime`",
	type: "Utility ⚙️",
	data: new SlashCommandBuilder()
		.setName("uptime")
		.setDescription("Will respond with pong!")
		.setContexts(0, 1, 2) // 0 for guild | 1 for botDM | 2 everywhere
		.setIntegrationTypes(0, 1) // 0 for guild install | 1 for user install
		.setNSFW(false),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	execute(interaction, client) {

		const days = Math.floor(client.uptime / 86400000)
		const hours = Math.floor(client.uptime / 3600000) % 24
		const minutes = Math.floor(client.uptime / 60000) % 60
		const seconds = Math.floor(client.uptime / 1000) % 60

		let time = 0;
		if (days == 0) {
			if (hours == 0) {
				time = `${minutes} minutes and ${seconds} seconds`;
			} else time = `${hours} h ${minutes} min ${seconds} sec`;
		} else time = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;

		const newEmbed = new EmbedBuilder()
			.setColor('#36393F')
			.setTitle('**My Uptime:**')
			.setDescription(time)
		interaction.reply({ embeds: [newEmbed], ephemeral: true});
	}
}
