const { ChatInputCommandInteraction, SlashCommandBuilder } = require("discord.js");

module.exports = {
	name: "bin",
	data: new SlashCommandBuilder()
	.setName("bin")
	.setDescription("Share your code."),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	execute(interaction) {
		interaction.reply({content: 'Please share your source code using https://srcshare.io/or https://sourceb.in.', ephemeral: true});
	}
}
