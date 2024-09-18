const colors = require("colors");
const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const Schema = require("../schemas/stats.js");
const UserStats = require("../schemas/userStats.js");

module.exports = {
	name: "interactionCreate",
	/**
	 *  @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction, client) {
		//if (!interaction.isCommand()) return;

		if (interaction.isAutocomplete()) {
			// Handle autocomplete interactions
			const command = client.commands.get(interaction.commandName);
			if (!command) return;
			
			if (command && command.autocomplete) {
				try {
					await command.autocomplete(interaction, client);
				} catch (error) {
					console.error('Error handling autocomplete:', error);
					// Optionally, you can send an error message to the user
				}
			}
		// handle dm commands
		} else if (interaction.isChatInputCommand() && !interaction.guildId) {
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
				const webhookId = client.config.config.logs[2].webhookId; // logs WEBEX
				const webhook = await client.fetchWebhook(webhookId);
				if (webhook) {
					const logEmbed = new EmbedBuilder()
						.setDescription(colors.green(
							`User: ${interaction.user.globalName}\nUser: <@${interaction.user.id}>\nCommand: "${command.name}"`
						))
						.setTimestamp();

					webhook.send({
						embeds: [logEmbed],
					});
				}
			} catch (error) {
				console.error(error);
				console.log(colors.green(
					`\nUser: ${interaction.user.globalName}\nCommand: "${command.name}"\nUser: ${interaction.user.tag}`
						.brightRed
				));
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
				//if (randomNRange(1000)) AD(interaction, false);
				await command.execute(interaction, client);
				console.log(colors.green(
					`\nGuild: ${interaction.member.guild.name}\nChannel: "${interaction.channel.name}"\nCommand: "${command.name}"\nUser: ${interaction.user.tag}\nTimestamp: ${Date().slice(0, -42)}`.brightGreen
				));
				const webhookId = client.config.config.logs[2].webhookId; // logs WEBEX
				const webhook = await client.fetchWebhook(webhookId);
				if (webhook) {
					const logEmbed = new EmbedBuilder()
						.setDescription(
							`Guild: ${interaction.guild.name}\nChannel: "${interaction.channel.name}"<#${interaction.channel.id}>\nUser: <@${interaction.user.id}>\nCommand: "${command.name}"`
						)
						.setTimestamp();

					webhook.send({
						embeds: [logEmbed],
					});
				}

				// updating stats
				const data = await Schema.findOne()
				if (!data) {
					data = await Schema.create({
						NMessages: 0,
						NUsedCmd: 0,
						servers: {
							total: client.guilds.cache.size,
							current: client.guilds.cache.size,
							last: 0,
							diff: client.guilds.cache.size
						}
					})
					console.log("something went wrong when trying tog get bot stats");
				}
				if (!data.servers) {
					data.servers = {
						total: client.guilds.cache.size,
						current: client.guilds.cache.size,
						last: 0,
						diff: client.guilds.cache.size
					}
				}
				let i = data.cmds.findIndex(obj => obj.name == command.name);
				if (i === -1) {
					const obj = {
						name: command.name,
						type: command.type,
						uses: 1
					}
					data.cmds.push(obj);
				} else
					data.cmds[i].uses = data.cmds[i].uses + 1;

				data.NUsedCmd = data.NUsedCmd + 1;
				//console.log(data.NUsedCmd, "cmds!");
				await data.save();

				let userData = await UserStats.findOne({ UserId: interaction.user.id });
				if (!userData) {
					userData = await UserStats.create({
						User: interaction.user.username,
						UserId: interaction.user.id,
						Avatar: interaction.user.avatar,
						Banner: interaction.user.banner || "",
						Messages: 0,
						CmdCount: 0,
						Votes: {
							count: 0,
							last: null
						},
					})
				}
				if (userData.Avatar != interaction.user.avatar) userData.Avatar = interaction.user.avatar;
				userData.CmdCount = userData.CmdCount + 1;
				await userData.save();
			} catch (error) {
				console.error(error, interaction);
				console.log(colors.green(
					`\nChannel: "${interaction.channel.name}\nCommand: "${command.name}"\nUser: ${interaction.user.tag}`
						.brightRed
				));
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
		}
	},
};
