const { ChannelType, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const ticketSchema = require('../schemas/TicketSys.js');
const TTranscriptSchema = require('../schemas/TicketTranscripts.js');

// this is to restore the data thats in the cache of the tickets.
const { loadCacheFromFile } = require('../functions/utils.js');

// array of all the tickets ids
// so it can later know what channels to read in the messageCreate event.
var ticketsChannelsID = loadCacheFromFile('cache.json') || {};

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
					allow: [
						PermissionsBitField.Flags.ViewChannel,
						PermissionsBitField.Flags.SendMessages,
						PermissionsBitField.Flags.ReadMessageHistory,
						PermissionsBitField.Flags.AttachFiles,
						PermissionsBitField.Flags.EmbedLinks,
						PermissionsBitField.Flags.AddReactions,
						PermissionsBitField.Flags.UseExternalStickers,
						PermissionsBitField.Flags.UseExternalEmojis,
						PermissionsBitField.Flags.SendVoiceMessages
					]
				}
			]
		});

		if (!ticketsChannelsID[channel.id]) ticketsChannelsID[channel.id] = [];

		// copy the main obj to a tmp and then save with the ticket id so later I know what channel to delete
		const obj = { MemberId: interaction.user.id, ChannelId: channel.id };
		ticketData.Tickets.push(obj);
		if (!ticketData.TicketId) ticketData.TicketId = 0;
		ticketData.TicketId = parseInt(ticketData.TicketId) + 1;
		await ticketData.save();

		const iconURL = interaction.guild.iconURL();
		const validIconURL = (iconURL && iconURL !== 'null' && /^(http|https):\/\/[^\s]+$/.test(iconURL)) ? iconURL : null;

		const newEmbed = new EmbedBuilder()
			.setDescription("Support will be right with you shortly.\nTo close this ticket react with 🔒")
			.setColor("Blurple")
			.setFooter({ text: `${interaction.guild.name}`, iconURL: validIconURL })
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
		let member = await interaction.guild.members.cache.get(ticketData.Tickets[i].MemberId);
		// maybe someday move this so that even if members leave people can save the transcript and not just delete the channel
		if (!member) member = (await interaction.client.users.fetch(ticketData.Tickets[i].MemberId).member).catch(async (err) => {
			await interaction.channel.send({ content: `The member that openned the ticket left the server so the ticket will be closed in a couple of seconds`}).then((msg) => { setTimeout(() => { msg.channel.delete(); }, 5 * 1000); })
			console.log(err);
		});

		await channel.permissionOverwrites.set([
			{
				id: interaction.guild.id,
				deny: [PermissionsBitField.Flags.ViewChannel]
			},
			{
				id: member.id,
				deny: [
					PermissionsBitField.Flags.ViewChannel,
					PermissionsBitField.Flags.SendMessages,
					PermissionsBitField.Flags.ReadMessageHistory,
					PermissionsBitField.Flags.AttachFiles,
					PermissionsBitField.Flags.EmbedLinks,
					PermissionsBitField.Flags.AddReactions,
					PermissionsBitField.Flags.UseExternalStickers,
					PermissionsBitField.Flags.UseExternalEmojis,
					PermissionsBitField.Flags.SendVoiceMessages
				]
			}
		]).catch((err) => { console.error("Error trying to overwrite a member's perms: ", err) });

		const newEmbed = new EmbedBuilder()
			.setDescription(`Ticket Closed by ${interaction.user}`)
			.setColor("Yellow")
		const embed = new EmbedBuilder()
			.setDescription('```Support team ticket controls```')
			.setColor("#36393F")

		const btn = new ActionRowBuilder().setComponents(
			new ButtonBuilder()
				.setCustomId("transcriptTicket")
				.setLabel("Transcript")
				.setEmoji("📝")
				.setStyle(ButtonStyle.Secondary),
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

async function transcriptTicket(interaction) {
	if (interaction.customId === "transcriptTicket") {
		const channel = interaction.channel;

		const messages = ticketsChannelsID[channel.id];
		if (!messages) return interaction.reply({ content: `There are no messages to save here.` });

		const userId = channel.topic.match(/\|\s(\d+)$/)?.[1];
		if (!userId) return interaction.reply({ content: 'Could not find the user ID in the channel topic.\n Make sure its there or if its the correct one.', ephemeral: true });
		const userOpenTicket = await interaction.guild.members.cache.get(userId);
		if (!userOpenTicket) userOpenTicket = await interaction.guild.members.fetch(userId);
		if (!userOpenTicket) await interaction.reply({ content: `❌ Something when wrong!\nThe user that opened the ticket is no longer in the server so i will not be able to send them the transcript.` });

		await TTranscriptSchema.findOneAndUpdate(
			{ ticketId: channel.id },
			{ messages },
			{ upsert: true, new: true }
		);

		if (userOpenTicket) await userOpenTicket.send({ content: `You can see the Transcript of the ticket [here](https://api.yourbestbot.pt/transcript/${channel.id})`}).catch(err => console.log(err, `Tried to send a DM to the user with the ticket Transcript but didnt worked :(`));
		if (interaction.user.id != userId)
			await interaction.user.send({ content: `You can see the Transcript of the ticket [here](https://api.yourbestbot.pt/transcript/${channel.id})`}).catch(err => console.log(err, `Tried to send a DM to the user with the ticket Transcript but didnt worked :(`));
		console.log(`https://api.yourbestbot.pt/transcript/${channel.id}`)

		// still need to make a better system for this, maybe a channel to post all transcripts
		// maybe just to the user that opened the ticket and print it into the channel so mods can see even when the ticket is closed.
		// maybe sending to everyone in the ticket is not the best idea, ratelimits and spam
		function TranscriptEmbed(userID) {
			return new EmbedBuilder()
			.setColor('Green')
			.setDescription(`Transcript saved and sent to <@${userID}>`);
		}

		await channel.send({ embeds: userOpenTicket ? interaction.member.id == userId ? [TranscriptEmbed(userId)] : [TranscriptEmbed(interaction.user.id), TranscriptEmbed(userId)] : [TranscriptEmbed(interaction.user.id)] });
	}
}

async function reopenTicket(interaction) {
	if (interaction.customId === "reopenTicket") {
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
		let member = await interaction.guild.members.cache.get(ticketData.Tickets[i].MemberId);
		if (member)
			await channel.setName(`closed-${member.user.username}`).catch(console.error);
		await channel.delete().catch((err) => {
			interaction.reply({ content: "There was an error trying to delete the channel.", ephemeral: true });
			return console.error("Error trying to delete the ticket! (interactionCreate.js)", err);
		});
		ticketData.Tickets.splice(i, 1);
		await ticketData.save();
		delete ticketsChannelsID[channel.id]; // deletes the data from the obj
	}
}

async function rmFromCache(guildId, arrayChannelId) {
	const ticketData = await ticketSchema.findOne({ GuildId: guildId });
	arrayChannelId.forEach((channelId) => {
		const i = ticketData.Tickets.findIndex((e) => e.ChannelId == channelId);
		ticketData.Tickets.splice(i, 1);
		delete ticketsChannelsID[channelId]; // deletes the data from the obj
		console.log(`${channelId} removed`);
	})
	await ticketData.save();
}

async function TicketSystem(interaction) {
	newTicket(interaction);
	closeTicket(interaction);
	transcriptTicket(interaction);
	reopenTicket(interaction);
	deleteTicket(interaction);
}

module.exports = { TicketSystem, ticketsChannelsID, rmFromCache };