const { ChannelType, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const ticketSchema = require('../schemas/TicketSys.js');

async function newTicket(interaction) {
	if (interaction.customId === "newticket") {
		let ticketData = await ticketSchema.findOne({ GuildId: interaction.guild.id });
		if (!ticketData) return await interaction.reply({ content: "Sorry! It lokks like you found this message but the ticket system is not yet setup here.", ephemeral: true });

		const category = await interaction.guild.channels.cache.get(ticketData.CategoryId);

		const channel = await interaction.guild.channels.create({
			name: `ticket-${ticketData.TicketId}-${interaction.user.username}`,
			type: ChannelType.GuildText,
			parent: category,
			topic: `Ticket user: ${interaction.user} | ${interaction.user.id}`,
			permissionOverwrites: [
				{
					id: interaction.guild.id,
					deny: [PermissionsBitField.Flags.ViewChannel]
				},
				{
					id: interaction.user.id,
					allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory]
				}
			]
		});

		// copy the main obj to a tmp and then save with the ticket id so later I know what channel to delete
		const obj = { MemberId: interaction.user.id, ChannelId: channel.id };
		ticketData.Tickets.push(obj);
		if (!ticketData.TicketId) ticketData.TicketId = 0;
		ticketData.TicketId = parseInt(ticketData.TicketId) + 1;
		await ticketData.save();

		const newEmbed = new EmbedBuilder()
			.setDescription("Support will be right with you shortly.\nTo close this ticket react with 🔒")
			.setColor("Blurple")
			.setFooter({ text: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL()}` })
			.setTimestamp()

		const btn = new ActionRowBuilder().setComponents(
			new ButtonBuilder()
				.setCustomId("closeTicket")
				.setLabel("Close")
				.setEmoji("🔒")
				.setStyle(ButtonStyle.Secondary))

		await channel.send({ content: `${interaction.user} Welcome.`, embeds: [newEmbed], components: [btn] });
		await interaction.reply({ content: `✔ *Ticket Created* <#${channel.id}>`, ephemeral: true });
	}
}

async function closeTicket(interaction) {
	if (interaction.customId === "closeTicket") {
		const channel = interaction.channel;

		const ticketData = await ticketSchema.findOne({ GuildId: interaction.guild.id });

		const i = ticketData.Tickets.findIndex((e) => e.ChannelId == interaction.channel.id);
		const member = await interaction.guild.members.cache.get(ticketData.Tickets[i].MemberId);

		await channel.permissionOverwrites.set([
			{
				id: interaction.guild.id,
				deny: [PermissionsBitField.Flags.ViewChannel]
			},
			{
				id: member.id,
				deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory]
			}
		]).catch((err) => { console.error("Error trying to overwrite a member's perms: ", err) });

		const newEmbed = new EmbedBuilder()
			.setDescription(`Ticket Closed by ${interaction.user}`)
			.setColor("Yellow")
		const embed = new EmbedBuilder()
			.setDescription('````Support team ticket controls```')
			.setColor("#36393F")

		const btn = new ActionRowBuilder().setComponents(
			new ButtonBuilder()
				.setCustomId("reopenTicket")
				.setLabel("Open")
				.setEmoji("🔓")
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId("deleteTicket")
				.setLabel("Delete")
				.setEmoji("⛔")
				.setStyle(ButtonStyle.Secondary))
		
		await channel.send({ embeds: [newEmbed, embed], components: [btn] });
	}
}

async function reopenTicket(interaction) {
	if (interaction.customId === "reopenTicket") {
		const channel = interaction.channel;

		const ticketData = await ticketSchema.findOne({ GuildId: interaction.guild.id });
		const i = ticketData.Tickets.findIndex((e) => e.GuildId == interaction.guild.id);
		const member = await interaction.guild.members.cache.get(ticketData.Tickets[i].MemberId);
		await channel.permissionOverwrites.set([
			{
				id: interaction.guild.id,
				deny: [PermissionsBitField.Flags.ViewChannel]
			},
			{
				id: member.id,
				allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory]
			}
		]).catch((err) => { console.error("Error trying to overwrite a member's perms: ", err) });

		const newEmbed = new EmbedBuilder()
		.setDescription(`Ticket Re-Openned by ${interaction.user}`)
		.setColor("Green")

		await interaction.message.delete().catch(console.error);
		await channel.send({ embeds: [newEmbed] });
	}
}

async function deleteTicket(interaction) {
	if (interaction.customId === "deleteTicket") {
		const channel = interaction.channel;

		const ticketData = await ticketSchema.findOne({ GuildId: interaction.guild.id });
		const i = ticketData.Tickets.findIndex((e) => e.ChannelId == interaction.channel.id);
		const user = await interaction.guild.members.cache.get(ticketData.Tickets[i].MemberId);
		channel.setName(`closed-${user.username}`).catch(console.error);
		channel.delete().catch((err) => {
			interaction.reply({ content: "There was an error trying to delete the channel.", ephemeral: true });
			return console.error("Error trying to delete the ticket! (interactionCreate.js)", err);
		});
		ticketData.Tickets.splice(i, 1);
		await ticketData.save();
	}
}

async function TicketSystem(interaction) {
	newTicket(interaction);
	closeTicket(interaction);
	reopenTicket(interaction);
	deleteTicket(interaction);
}

module.exports = { TicketSystem };