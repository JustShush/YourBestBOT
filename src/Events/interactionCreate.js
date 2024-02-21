const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const Schema = require("../schemas/stats.js");

module.exports = {
	name: "interactionCreate",
	/**
	 *  @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction, client) {
		if (!interaction.isCommand()) return;

		// handle dm commands
		if (interaction.isChatInputCommand() && !interaction.guildId) {
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

			try {
				await command.execute(interaction, client);
				console.log(
					`\nUser: ${interaction.user.globalName}\n\nCommand: "${command.name}"\nUser: ${interaction.user.tag}\nTimestamp: ${Date().slice(0, -42)}`.brightGreen
				);
				const channel = "964932900652986428"; // logs WEBEX
				const check = client.channels.cache.get(channel);
				if (check) {
					const logEmbed = new EmbedBuilder()
						.setDescription(
							`User: ${interaction.user.globalName}\nUser: <@${interaction.user.id}>\nCommand: "${command.name}"`
						)
						.setTimestamp();

					check.send({
						embeds: [logEmbed],
					});
				}
			} catch (error) {
				console.error(error);
				console.log(
					`\nUser: ${interaction.user.globalName}\nCommand: "${command.name}"\nUser: ${interaction.user.tag}`
						.brightRed
				);
				const errorEmbed = new EmbedBuilder()
					.setTitle('An error occured')
					.setDescription(`${error}`)
					.setColor('Red');

				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
				} else {
					await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
				}
			}
		} else if (interaction.isChatInputCommand()) {

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

			try {
				const data = await Schema.findOne()
				if (!data) {
					data = await Schema.create({
						NMessages: 0,
						NUsedCmd: 1
					})
					console.log("something went wrong when trying tog get bot stats");
				}
				data.NUsedCmd = data.NUsedCmd + 1;
				await data.save();
				//if (randomNRange(1000)) AD(interaction, false);
				await command.execute(interaction, client);
				console.log(
					`\nGuild: ${interaction.guild.name}\nChannel: "${interaction.channel.name}"\nCommand: "${command.name}"\nUser: ${interaction.user.tag}\nTimestamp: ${Date().slice(0, -42)}`.brightGreen
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
			} catch (error) {
				console.error(error);
				console.log(
					`\nGuild: ${interaction.guild.name}\nChannel: "${interaction.channel.name}"\nCommand: "${command.name}"\nUser: ${interaction.user.tag}`
						.brightRed
				);
				const errorEmbed = new EmbedBuilder()
					.setTitle('An error occured')
					.setDescription(`${error}`)
					.setColor('Red');

				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
				} else {
					await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
				}
			}
		} else if (interaction.isAutocomplete()) {
			// Handle autocomplete interactions
			const command = client.commands.get(interaction.commandName);

			if (command && command.handleAutocomplete) {
				try {
					await command.handleAutocomplete(interaction, client);
				} catch (error) {
					console.error('Error handling autocomplete:', error);
					// Optionally, you can send an error message to the user
				}
			}
		}
	},
};