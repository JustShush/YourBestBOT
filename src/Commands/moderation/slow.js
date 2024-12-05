const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const logdb = require("../../schemas/log");

module.exports = {
	name: "slowmode",
	description: "Change the slowmode of the current channel.",
	permission: "`MANAGE_CHANNELS`, `MANAGE_GUILD`",
	usage: "`/slowmode [time]`",
	type: "Moderation 🛠️",
	data: new SlashCommandBuilder()
		.setName("slowmode")
		.setDescription("Change the Slowmode.")
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ManageGuild)
		.addNumberOption((option) => option
			.setName("time")
			.setDescription("The time for the slowmode.")
			.setRequired(true)
		)
		.setDMPermission(false)
		.setNSFW(false),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction, client) {

		const { options } = interaction

		const Time = options.getNumber("time");

		interaction.channel.setRateLimitPerUser(Time);

		const logchannel = await logdb.findOne({ Guild: guild.id });
		if (logchannel) {
			// get the webhook from client
			const webhook = await client.fetchWebhook(logchannel.General.webhookId);
			if (webhook)
				webhook.send({ content: `${interaction.member} set the channel: ${interaction.channel} slowmode to: \`${Time.toString()}\`` });
		}

		await interaction.reply({ content: `The Slowmode of this channel has been set to ${Time}s` });
	}
}
