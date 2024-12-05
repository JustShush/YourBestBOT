const { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js");
const { checkGWs, shuffledArray } = require('../../functions/gwUtils.js');
const gwSchema = require('../../schemas/gwSchema.js');
const ms = require("ms");

module.exports = {
	name: "giveaway",
	description: "An advanced giveaway system.",
	permission: "`SEND_MESSAGES`",
	subcommand: true,
	permission: "ManageChannels",
	type: "Giveaway 🎉",
	data: new SlashCommandBuilder()
		.setName("giveaway")
		.setDescription("An advanced giveaway system.")
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
		.addSubcommand(sub => sub
			.setName('start')
			.setDescription('Starts a giveaway.')
			.addStringOption(o => o
				.setName('prize')
				.setDescription('The prize of the giveaway. (1 month of nitro)')
				.setRequired(true)
			)
			.addIntegerOption(o => o
				.setName('winners')
				.setDescription('The number of winners')
				.setRequired(true)
			)
			.addStringOption(options => options
				.setName("duration")
				.setDescription("Provide a duration for this timeout (1m, 1h, 1d)")
				.setRequired(true)
			)
		)
		.addSubcommand(sub => sub
			.setName('end')
			.setDescription('Ends a giveaway.')
			.addStringOption(o => o
				.setName('message-id')
				.setDescription('The message ID of the giveaway.')
				.setRequired(true)
			)
		)
		.addSubcommand(sub => sub
			.setName('pause')
			.setDescription('Pauses a giveaway.')
			.addStringOption(o => o
				.setName('message-id')
				.setDescription('The message ID of the giveaway.')
				.setRequired(true)
			)
		)
		.addSubcommand(sub => sub
			.setName('resume')
			.setDescription('Resumes a giveaway.')
			.addStringOption(o => o
				.setName('message-id')
				.setDescription('The message ID of the giveaway.')
				.setRequired(true)
			)
		)
		.addSubcommand(sub => sub
			.setName('reroll')
			.setDescription('Resumes a giveaway.')
			.addStringOption(o => o
				.setName('message-id')
				.setDescription('The message ID of the giveaway.')
				.setRequired(true)
			)
		)
		.addSubcommand(sub => sub
			.setName('delete')
			.setDescription('Deletes a giveaway.')
			.addStringOption(o => o
				.setName('message-id')
				.setDescription('The message ID of the giveaway.')
				.setRequired(true)
			)
		)
		.setContexts(0)
		.setIntegrationTypes(0)
		.setDMPermission(false)
		.setNSFW(false),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {Client} client
	 */
	async execute(interaction, client) {

		const { options } = interaction;

		let shuffledParticipants, shuffledWinners, channel, schema;
		let mentions, row, embed, messageId, message, remaniningTime;

		const gwDisableBtn = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId('z')
				.setLabel('🎉')
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(true)
		);

		if (options.getSubcommand() !== 'start') {
			messageId = options.getString('message-id');

			schema = await gwSchema.findOne({ MessageId: messageId });
			if (!schema)
				return interaction.reply({ content: `No giveaway was found with that message ID.`, ephemeral: true });

			channel = client.channels.cache.get(schema.ChannelId);
			message = await channel.messages.fetch(schema.MessageId);
		}

		switch (options.getSubcommand()) {
			case 'start':
				const prize = options.getString('prize');
				const winnerCount = options.getInteger('winners');
				const time = options.getString('duration');
				const timeInMs = ms(time);
				const endTimestamp = new Date(new Date().getTime() + timeInMs).getTime();

				embed = new EmbedBuilder()
					.setTitle('🎉 Giveaway 🎉')
					.setDescription(`React with 🎉 to enter the giveaway for **${prize}**!\n\n\`⏱️\` This giveaway will end <t:${Math.floor(endTimestamp / 1000)}:R>`)
					.addFields(
						{
							name: '`👤` Entries',
							value: '`0`',
							inline: true
						},
						{
							name: '`🏆` Winners',
							value: `\`${winnerCount}\``,
							inline: true
						}
					)
					.setColor('White')
					.setFooter({ text: 'Ends at' })
					.setTimestamp(endTimestamp);

				row = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setCustomId('giveawayBtn')
						.setLabel('🎉')
						.setStyle(ButtonStyle.Secondary)
				);

				const gwMsg = await interaction.channel.send({ embeds: [embed], components: [row] });

				const gwData = new gwSchema({
					Ended: false,
					Paused: false,
					GuildId: interaction.guild.id,
					ChannelId: interaction.channel.id,
					MessageId: `${gwMsg.id}`,
					EndTimestamp: endTimestamp,
					Prize: prize,
					Participants: [],
					WinnerCount: winnerCount
				});
				await gwData.save().catch((err) => console.log(err));

				interaction.reply({ content: 'Giveaway Started', ephemeral: true });

				break;
			case 'end':
				if (schema.Ended)
					return interaction.reply({ content: 'Giveaway has already ended!', ephemeral: true });
				if (schema.Paused)
					return interaction.reply({ content: 'Giveaway is paused!', ephemeral: true });

				shuffledParticipants = shuffledArray(schema.Participants);
				shuffledWinners = shuffledParticipants.slice(0, schema.WinnerCount);

				row = gwDisableBtn;

				if (!shuffledWinners.length) {
					interaction.reply({ content: 'Giveaway Ended!', ephemeral: true });

					embed = new EmbedBuilder()
						.setTitle('`🛑` Giveaway Ended!')
						.setDescription(`This giveaway ended <t:${Math.floor(schema.EndTimestamp / 1000)}:R>`)
						.setColor('#FFFFFF')
						.addFields(
							{ name: '`👤` Entries', value: `\`${schema.Participants.length}\``, inline: true },
							{ name: '`🏆` Winners', value: '*No one entered the giveaway*', inline: true }
						)

					const endMessage = await message.edit({ embeds: [newEmbed], components: [row] });

					endMessage.reply({ content: `*Giveaway ended, but no one joined the giveaway.* [↗](https://discord.com/channels/${endMessage.guildId}/${endMessage.channelId}/${endMessage.id})` });

					schema.Ended = true;
					await schema.save().catch(err => console.log(err));
				} else {
					interaction.reply({ embeds: [new EmbedBuilder().setDescription('Ended the giveaway!').setColor('White')], ephemeral: true });
					mentions = shuffledWinners.map(w => `<@${w}>`).join(', ');
					newEmbed = new EmbedBuilder()
						.setTitle('`🛑` Giveaway Ended!')
						.setDescription(`This giveaway ended <t:${Math.floor(schema.EndTimestamp / 1000)}:R>`)
						.setColor('#FFFFFF')
						.addFields(
							{ name: '`👤` Entries', value: `\`${schema.Participants.length}\``, inline: true },
							{ name: '`🏆` Winners', value: `${mentions}`, inline: true }
						)

					const endMessage = await message.edit({ embeds: [newEmbed], components: [row] });

					endMessage.reply({ content: `Congratulations ${mentions}! You won the **${schema.Prize}** giveaway! [↗](https://discord.com/channels/${endMessage.guildId}/${endMessage.channelId}/${endMessage.id})` });

					schema.Ended = true;
					await schema.save().catch(err => console.log(err));
				}
				break;
			case 'pause':
				if (schema.Ended)
					return interaction.reply({ content: 'Giveaway has already ended!', ephemeral: true });
				if (schema.Paused)
					return interaction.reply({ content: 'Giveaway is paused!', ephemeral: true });

				remaniningTime = schema.EndTimestamp - new Date().getTime();

				schema.RemainingTime = remaniningTime;
				schema.Paused = true;
				await schema.save().catch((err) => console.log(err));

				embed = new EmbedBuilder()
					.setTitle('`⏹️` Giveaway paused')
					.setDescription(`This giveaway was paused by: ${interaction.user.displayName}\nPaused: <t:${Math.floor(new Date().getTime() / 1000)}:R>\nRemaining Time: <t:${Math.floor(remaniningTime / 1000)}`)
					.setColor('White');

				row = gwDisableBtn;
				message.edit({ embeds: [embed], components: [row] });

				await interaction.reply({ content: `Giveaway paused successfully! [↗](https://discord.com/channels/${message.guildId}/${message.channelId}/${message.id})`, ephemeral: true });

				break;
			case 'resume':
				if (schema.Ended)
					return interaction.reply({ content: 'Giveaway has already ended!', ephemeral: true });

				const newEnedtimestamp = new Date().getTime() + schema.RemainingTime;

				schema.Paused = false;
				schema.EndTimestamp = newEnedtimestamp;
				delete schema.RemainingTime;
				await schema.save().catch((err) => console.log(err));

				embed = new EmbedBuilder()
					.setTitle('🎉 Giveaway 🎉')
					.setDescription(`React with 🎉 to enter the giveaway for **${schema.Prize}**!\n\n\`⏱️\` This giveaway will end <t:${Math.floor(newEnedtimestamp / 1000)}:R>`)
					.addFields(
						{
							name: '`👤` Entries',
							value: `\`${schema.Participants.length}\``,
							inline: true
						},
						{
							name: '`🏆` Winners',
							value: `\`${schema.WinnerCount}\``,
							inline: true
						}
					)
					.setColor('White')
					.setFooter({ text: 'Ends at' })
					.setTimestamp(newEnedtimestamp);

				row = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setCustomId('giveawayBtn')
						.setLabel('🎉')
						.setStyle(ButtonStyle.Secondary)
				);

				message.edit({ embeds: [embed], components: [row] });

				await interaction.reply({ content: `Giveaway resumed successfully! [↗](https://discord.com/channels/${message.guildId}/${message.channelId}/${message.id})`, ephemeral: true });
				break;

			case 'reroll':
				if (!schema.Ended)
					return interaction.reply({ content: 'Giveaway has not ended yet!', ephemeral: true });

				shuffledParticipants = shuffledArray(schema.Participants.slice());
				shuffledWinners = shuffledParticipants.slice(0, schema.WinnerCount);

				if (!shuffledWinners)
					return interaction.reply({ content: 'Rerolled the giveaway, but no new winners were selected!', ephemeral: true });

				interaction.reply({ content: 'Giveaway rerolled successfully!', ephemeral: true });

				mentions = shuffledWinners.map((w) => `<@${w}>`).join(', ');

				embed = new EmbedBuilder()
					.setTitle('`🔄` Giveaway rerolled')
					.setDescription(`This rerolled giveaway ended <t:${Math.floor(new Date().getTime() / 1000)}:R>`)
					.addFields(
						{ name: '`👤` Entries', value: `\`${schema.Participants.length}\``, inline: true },
						{ name: '`🏆` New Winners', value: `${mentions}`, inline: true }
					)
					.setColor('FFFFFF');

				row = gwDisableBtn;

				const rerollMsg = await message.edit({ embeds: [embed], components: [row] });

				rerollMsg.reply({ content: `Congratulations ${mentions}! You won the rerolled giveaway for **${schema.Prize}**! [↗](https://discord.com/channels/${rerollMsg.guildId}/${rerollMsg.channelId}/${rerollMsg.id})` });
				break;

			case 'delete':

				await message.delete();
				await gwSchema.findOneAndDelete({ MessageId: messageId });

				interaction.reply({ content: 'Giveaway deleted successfully!', ephemeral: true });

				break;

			default:
				break;
		}

	}
}