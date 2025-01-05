const { ChatInputCommandInteraction, SlashCommandBuilder } = require("discord.js");

module.exports = {
	name: "ping",
	description: "Ping the bot to see if it's alive.",
	permission: "`SEND_MESSAGES`",
	usage: "`/ping`",
	type: "Utility ⚙️",
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Will respond with pong!")
		.setContexts(0, 1, 2) // 0 for guild | 1 for botDM | 2 everywhere
		.setIntegrationTypes(0, 1) // 0 for guild install | 1 for user install
		.setNSFW(false),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	execute(interaction) {
		interaction.reply({ content: "Pong!", ephemeral: true });
	}
}
