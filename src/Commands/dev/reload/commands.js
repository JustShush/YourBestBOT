const { ChatInputCommandInteraction, Client } = require("discord.js");
const { loadCommands } = require("../../../handlers/command_Handler");

module.exports = {
	name: "reload.commands",
	subCommand: "reload.commands",
	/**
	 * 
	 * @param {ChatInputCommandInteraction} interaction 
	 * @param {Client} client 
	 */
	execute(interaction, client) {
		loadCommands(client);
		interaction.reply({content: "Reloaded Commands.", ephemeral: true});
	}
}