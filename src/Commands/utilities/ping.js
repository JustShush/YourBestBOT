const { ChatInputCommandInteraction, SlashCommandBuilder } = require("discord.js");

module.exports = {
	name: "ping",
	permissions: [],
	data: new SlashCommandBuilder()
	.setName("ping")
	.setDescription("Will respond with pong!"),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	execute(interaction) {
		interaction.reply({content: "Pong!", ephemeral: true});
	}
}
