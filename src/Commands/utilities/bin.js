const { ChatInputCommandInteraction, SlashCommandBuilder } = require("discord.js");

module.exports = {
	name: "bin",
	description: "Share your code using this links.",
	permission: "`SEND_MESSAGES`",
	usage: "`/bin`",
	type: "Utility",
	data: new SlashCommandBuilder()
		.setName("bin")
		.setDescription("Share your code.")
		.setDMPermission(true)
		.setNSFW(false),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	execute(interaction) {
		interaction.reply({ content: 'Please share your source code using https://srcshare.io/or https://sourceb.in.', ephemeral: true });
	}
}
