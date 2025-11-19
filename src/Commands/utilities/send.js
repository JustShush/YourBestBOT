const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, PermissionFlagsBits } = require("discord.js");
const axios = require('axios');
const UserStatsSchema = require('../../schemas/userStats.js');

module.exports = {
	name: "send",
	description: "Send a message to the devs \<3",
	permission: "`SEND_MESSAGES`",
	subcommand: true,
	type: "Utility ⚙️",
	data: new SlashCommandBuilder()
		.setName("send")
		.setDescription("Send a message to the devs")
		.addSubcommand(sub => sub
			.setName('a-bug')
			.setDescription('Send a bug to the devs')
			.addStringOption(o => o
				.setName('title')
				.setDescription('Title of the problem')
				.setRequired(true)
			)
			.addStringOption(o => o
				.setName('description')
				.setDescription('Description of the problem')
				.setRequired(true)
			)
			.addAttachmentOption(o => o
				.setName('image')
				.setDescription('Send an image to show the error')
				.setRequired(false)
			)
		)
		.addSubcommand(sub => sub
			.setName('a-suggestion')
			.setDescription('Send a suggestion to the devs')
			.addStringOption(o => o
				.setName('title')
				.setDescription('Title of the problem')
				.setRequired(true)
			)
			.addStringOption(o => o
				.setName('description')
				.setDescription('Description of the problem')
				.setRequired(true)
			)
			.addAttachmentOption(o => o
				.setName('image')
				.setDescription('Send an image to show the error')
				.setRequired(false)
			)
		)
		.addSubcommand(sub => sub
			.setName('feeback')
			.setDescription('Tell us what can be changed about something')
			.addStringOption(o => o
				.setName('title')
				.setDescription('Title of the problem')
				.setRequired(true)
			)
			.addStringOption(o => o
				.setName('description')
				.setDescription('Description of the problem')
				.setRequired(true)
			)
			.addAttachmentOption(o => o
				.setName('image')
				.setDescription('Send an image to show the error')
				.setRequired(false)
			)
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands, PermissionFlagsBits.SendMessages)
		.setContexts(0, 1, 2) // 0 for guild | 1 for botDM | 2 everywhere
		.setIntegrationTypes(0, 1) // 0 for guild install | 1 for user install
		.setNSFW(false),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction) {

		const cmd = interaction.options.getSubcommand();

		const title = interaction.options.getString('title')
		const description = interaction.options.getString('description');
		const file = interaction.options.getAttachment('image');

		const webhookId = interaction.client.config.config.logs[2].webhookId; // logs WEBEX
		const webhook = await interaction.client.fetchWebhook(webhookId).catch(err => console.log(err));
		if (!webhook) return interaction.reply({ content: `Something when wrong sorry \<3` });
		const newEmbed = new EmbedBuilder()
			.setTitle(`${cmd}`)
			.setDescription(`Title: ${title}\nDescription: ${description}`)
			.setColor('Green')
			.setTimestamp()
			
		if (file) {
			newEmbed.setImage('attachment://image.png')
			await webhook.send({ content: `<@453944662093332490>\nSent from: <@interaction.user.id> | ${file.url}`, embeds: [newEmbed], files: [file.url] });
		} else
			await webhook.send({ content: `<@453944662093332490>`, embeds: [newEmbed] });

		await interaction.reply({ content: `Thank you for Reporting, we will get back to you soon, join the discord YBB Support https://discord.gg/WhSYAUtar5 to get notified about this issue, have your DMs open so we can send a message to you about this issue, Thank you <3`, ephemeral: true });
	}
}
