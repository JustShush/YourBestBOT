const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const logdb = require("../../schemas/log");

module.exports = {
	name: "ban",
	description: "Ban a member from this server.",
	permission: "`BAN_MEMBERS`",
	usage: "`/ban [member], /ban [member] [reason]`",
	type: "Moderation 🛠️",
	data: new SlashCommandBuilder()
		.setName("ban")
		.setDescription("Bans the member given.")
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
		.addUserOption((option) => option
			.setName("target")
			.setRequired(true)
			.setDescription(`The member you'd like to Ban`))
		.addStringOption((option) => option
			.setName("reason")
			.setDescription("The reason for Banning the member provided."))
		.setContexts(0) // 0 for guild | 1 for botDM | 2 everywhere
		.setIntegrationTypes(0) // 0 for guild install | 1 for user install
		.setNSFW(false),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction, client) {

		// random colors from one dark color palette 
		const colors = ['#282C34', '#E06C75', '#98C379', '#E5C07b', '#61AFEF', '#C678DD', '#56B6C2', '#ABB2BF', '#6B859E', '#3890E9', '#A359ED', '#EC5252', '#C97016', '#5DA713', '#13AFAF'];
		const color = Math.floor(Math.random() * colors.length);
		const resColor = colors[color];
		// end of the color randomization 

		const { options, guild } = interaction;

		const user = options.getUser("target");
		const member = await interaction.guild.members.fetch(user.id).catch(console.error);
		let reason = options.getString("reason");

		if (!reason) reason = "No reason given.";

		const kickEmbed = new EmbedBuilder()
			.setColor(resColor)
			.setTimestamp()

		await user.send({
			content: `${user}`,
			embeds: [kickEmbed.setDescription(`By: ${interaction.member}\nReason: \`\`\`${reason}\`\`\``).setTitle(`You have been Banned from: \`${interaction.guild.name}\``)]
		}).catch();

		await member.ban({
			deleteMessageSecconds: 1 * 24 * 60 * 60,
			reason: reason
		}).catch(console.error);

		const logchannel = await logdb.findOne({ Guild: guild.id });
		if (logchannel) {
			// get the webhook from client
			const webhook = await client.fetchWebhook(logchannel.General.webhookId);
			if (webhook) {
				const logEmbed = new EmbedBuilder()
					.setTitle(`${user.username} (${user.id}) has been banned.`)
					.setDescription(`By: ${interaction.member}\nReason: \`\`\`${reason}\`\`\``)
					.setTimestamp()

				webhook.send({ content: `${target}`, embeds: [logEmbed] });
			}
		}

		interaction.reply({ embeds: [kickEmbed.setDescription(`${user} as been Banned from the server successfully ✅\nReason: \`\`\`${reason}\`\`\``).setTitle(`Has been banned from the server.`)], ephemeral: true });
	}
}
