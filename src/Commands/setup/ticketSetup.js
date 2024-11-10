const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ChannelType, ButtonBuilder, ButtonStyle } = require('discord.js');
const ticketSchema = require('../../schemas/TicketSys.js');

module.exports = {
	name: "ticket",
	description: "Manage the ticket System.",
	type: "Setup",
	subcommand: true,
	permissions: "Administrator",
	data: new SlashCommandBuilder()
		.setName('ticket')
		.setDescription('Manage the ticket System.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addSubcommand(sub => sub
				.setName('send')
				.setDescription('Send the ticket message.')
				.addStringOption(o => o
					.setName("title")
					.setDescription('The Title of the embed.')
					.setRequired(true),
				)
				.addStringOption(o => o
					.setName("description")
					.setDescription("The Description of the embed."))
		)
		.addSubcommand(sub => sub
				.setName('setup')
				.setDescription('Setup the ticket category')
				.addChannelOption(o => o
					.setName("category")
					.setDescription("The category to send the tickets in")
					.addChannelTypes(ChannelType.GuildCategory)
					.setRequired(true))
		)
		.addSubcommand(sub => sub
				.setName('remove')
				.setDescription('Disable the ticket system.'),
		),
	async execute(interaction) {

		const { options } = interaction;
		const cmd = options.getSubcommand();

		const ticketSys = await ticketSchema.findOne({ GuildId: interaction.guild.id });

		switch (cmd) {
			case "send":

				if (!ticketSys) return await interaction.reply({ content: "You have to do </ticket setup:1305164630213267487> before you can send ticket message...", ephemeral: true });

				const title = options.getString("title");
				const des = options.getString("description") || "Create a ticket to talk with the staff team."
				const msg = des.replace(/\\n/g, '\n');

				const newEmbed = new EmbedBuilder()
					.setTitle(title)
					.setDescription(msg)
					.setColor("Blurple")
					.setFooter({ text: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL()}` })
					.setTimestamp()

				const btn = new ActionRowBuilder().setComponents(
					new ButtonBuilder()
					.setCustomId("newticket")
					.setLabel("Create ticket")
					.setEmoji("📩")
					.setStyle(ButtonStyle.Secondary))

				await interaction.reply({ content: 'Ticket Msg sent!', ephemeral: true });
				await interaction.channel.send({ embeds: [newEmbed], components: [btn] });

				break;

			case "setup":
					if (ticketSys) return await interaction.reply({ content: `Looks like you already have a ticket system set to \`<#${ticketSys.CategoryId}>\``, ephemeral: true });

					const category = options.getChannel("category");

					let ticketData = await ticketSchema.create({
						GuildId: interaction.guild.id,
						CategoryId: category.id,
						TicketId: '0',
						Tickets: [],
					});

					await interaction.reply({ content: `Ticket category has been set to **${category}**! Use </ticket send:1305164630213267487> to send a ticket create message`, ephemeral: true });
					await ticketData.save();
					break;

			case "remove":
					if (!ticketSys) return await interaction.reply({ content: `Looks like you don't already have a ticket system set`, ephemeral: true });
					else {
						await interaction.reply({ content: `Ticket system has been removed!`, ephemeral: true });
						await ticketSchema.deleteOne({ GuildId: interaction.guild.id });
					}
					break;
			default:
				// theres no need for default but ya its here ig
				break;
		}

	}
}