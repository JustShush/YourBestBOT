const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");

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
				ephemeral: true,
			});

		if (command.developer && interaction.user.id !== "453944662093332490")
			return interaction.reply({
				content: "This command is only available to the dev.",
				ephemeral: true,
			});

		const subCommand = interaction.options.getSubcommand(false);
		if (subCommand) {
			const subCommandFile = client.subCommands.get(`${interaction.commandName}.${subCommand}`);
			if (!subCommandFile)
				return interaction.reply({
					content: "This command is outdated.",
					ephemeral: true,
				});
			subCommandFile.execute(interaction, client);
		} else {
			try {
				command.execute(interaction, client);
				console.log(
					`\nGuild: ${interaction.guild.name}\nChannel: "${interaction.channel.name}"\nCommand: "${command.name}"\nUser: ${
						interaction.user.tag
					}\nTimestamp: ${Date().slice(0, -42)}`.brightGreen
				);
				const channel = "964932900652986428"; // logs WEBEX
				const check = client.channels.cache.get(channel);
				if (check) {
					const logEmbed = new EmbedBuilder()
						.setDescription(
							`Guild: ${interaction.guild.name}\nChannel: "${interaction.channel.name}"<#${interaction.channel.id}>\nUser: <@${interaction.user.id}>\nCommand: "${command.name}"`
						)
						.setTimestamp();

					check.send({
						embeds: [logEmbed],
					});
				}
			} catch (err) {
				console.log(err)
				console.log(
					`\nGuild: ${interaction.guild.name}\nChannel: "${interaction.channel.name}"\nCommand: "${command.name}"\nUser: ${interaction.user.tag}`
						.brightRed
				);
			}
		}
	},
};
