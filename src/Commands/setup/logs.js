const color = require('colors');
const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, EmbedBuilder, WebhookClient } = require("discord.js");
const fs = require("fs");
const db = require("../../schemas/log");

module.exports = {
	name: "setup-logs",
	description: "Setup the logs channel so you know when someone uses a command.",
	permission: "`MANAGE_CHANNELS`, `MANAGE_GUILD`",
	usage: "`/setup-logs [channel_id]`",
	type: "Setup",
	data: new SlashCommandBuilder()
		.setName("setup-logs")
		.setDescription("Set the channel log.")
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild, PermissionFlagsBits.ManageChannels)
		.addChannelOption(options => options
			.setName("channel")
			.setDescription("Select the channel log.")
			.setRequired(true)
		)
		.setDMPermission(false)
		.setNSFW(false),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction) {

		// random colors from one dark color palette
		const colors = ['#282C34', '#E06C75', '#98C379', '#E5C07b', '#61AFEF', '#C678DD', '#56B6C2', '#ABB2BF', '#6B859E', '#3890E9', '#A359ED', '#EC5252', '#C97016', '#5DA713', '#13AFAF'];
		const color = Math.floor(Math.random() * colors.length);
		const resColor = colors[color];
		// end of the color randomization

		const { options, guild, member } = interaction;

		const Channel = options.getChannel("channel");
		//console.log("Channel: " + Channel + "ChannelId: " + ChannelId);

		const errorsArray = [];
		const errorsEmbed = new EmbedBuilder()
			.setAuthor({ name: "Could not timeout member due to:" })
			.setColor("Red")

		if (!interaction.guild.channels.cache.get(Channel.id))
			errorsArray.push("That Channel is not in this guild!");

		if (!interaction.guild.members.me.permissions.has("ManageWebhooks"))
			errorsArray.push('I do not have permission to manage webhooks in this channel.');

		if (errorsArray.length) return interaction.reply({
			embeds: [errorsEmbed.setDescription(errorsArray.join("\n"))],
			ephemeral: true
		})

		let data = await db.findOne({
			Guild: guild.id,
			User: member.id,
			UserTag: interaction.user.tag,
		});

		const webhooks = await interaction.channel.fetchWebhooks();
		// Check if a webhook already exists for the channel
		let webhook = webhooks.find(webhook => webhook.owner.id === interaction.client.user.id);

		if (!webhook)
			webhook = await interaction.channel.createWebhook({
				name: "YourBestBot Logging",
				reason: "New webhook to log stuff <3"
			});

		//console.log(webhook, webhook.token);

		if (!data)
			data = await db.create({
				GuildName: interaction.guild.name,
				Guild: guild.id,
				UserId: member.id,
				UserTag: interaction.user.tag,
				General: {
					id: Channel.id,
					webhookId: webhook.id
				}
			});
		else {
			/*
			// in the other side fetch the webhook so i can send the msg
			const webhook = await client.fetchWebhook(webhookId);
			await webhook.send({ content: "test" }); */
			await client.fetchWebhooks(data.General.webhookId).then(async (wh) => { await wh.delete();} ).catch(console.error);
			data.General.id = Channel.id;
			data.General.webhookId = webhook.id;
			await data.save();
		}

		const newEmbed = new EmbedBuilder()
			.setColor(resColor)
			.setDescription(`✅ Logs Channel has been setup.\nChannel: \`${Channel}\``)
			.setTimestamp()

		return interaction.reply({ embeds: [newEmbed], ephemeral: true });
	}
}