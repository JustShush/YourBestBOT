const { ChatInputCommandInteraction, SlashCommandBuilder } = require("discord.js");

module.exports = {
	name: "bin",
	description: "Share your code using this links.",
	permission: "`SEND_MESSAGES`",
	usage: "`/bin`",
	type: "Utility ⚙️",
	data: new SlashCommandBuilder()
		.setName("bin")
		.setDescription("Share your code.")
		.setContexts(0, 1, 2) // 0 for guild | 1 for botDM | 2 everywhere
		.setIntegrationTypes(0, 1) // 0 for guild install | 1 for user install
		.setNSFW(false),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	execute(interaction) {
		interaction.reply({ content: 'Please share your source code using https://sourceb.in.', ephemeral: true });
	}
}
