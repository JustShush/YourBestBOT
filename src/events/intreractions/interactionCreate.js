const { ChatInputCommandInteraction } = require("discord.js");

module.exports = {
	name: "interactionCreate",
	/**
	 *  @param {ChatInputCommandInteraction} interaction
	 */
	execute(interaction, client) {
		if (!interaction.isChatInputCommand()) return;

		const command = client.commands.get(interaction.commandName);
		if (!command)
			return interaction.reply({
				content: "This command is outdated.",
				ephemeral: true
			});

		if (command.developer && interaction.user.id !== "453944662093332490") return interaction.reply({
			content: "This command is only available to the dev.",
			ephemeral: true
		});

		const subCommand = interaction.options.getSubcommand(false);
		if (subCommand) {
			const subCommandFile = client.subCommands.get(`${interaction.commandName}.${subCommand}`);
			if (!subCommandFile) return interaction.reply({
				content: "This command is outdated.",
				ephemeral: true
			});
			subCommandFile.execute(interaction, client);
		} else {
			try {
				command.execute(interaction, client);
				console.log(`\nGuild: ${interaction.guild.name}\nChannel: "${interaction.channel.name}"\nCommand: "${command.name}"\nUser: ${interaction.user.tag}`.brightGreen)
			} catch (err) {
				console.log(`\nGuild: ${interaction.guild.name}\nChannel: "${interaction.channel.name}"\nCommand: "${command.name}"\nUser: ${interaction.user.tag}`.brightRed)
			}
		}
	}
}