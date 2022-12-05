const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
	permissions: ["ADMINISTRATOR"],
	developer: true,
	data: new SlashCommandBuilder()
	.setName("reload")
	.setDescription("Reload your commands/events")
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
	.addSubcommand((options) => options
	.setName("events")
	.setDescription("Reload your events."))
	.addSubcommand((options) => options
	.setName("commands")
	.setDescription("Reload your commands.")),
}