const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const logdb = require("../../schemas/log");

module.exports = {
	name: "kick",
	description: "Kick a member from this server.",
	permission: "`KICK_MEMBERS`",
	usage: "`/kick [member], /kick [member] [reason]`",
	type: "Moderation 🛠️",
	data: new SlashCommandBuilder()
		.setName("kick")
		.setDescription("Kicks the member given.")
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
		.addUserOption((option) => option
			.setName("target")
			.setDescription(`The member you'd like to kick`)
			.setRequired(true))
		.addStringOption((option) => option
			.setName("reason")
			.setDescription("The reason for kicking the member provided."))
		.setContexts(0) // 0 for guild | 1 for botDM | 2 everywhere
		.setIntegrationTypes(0) // 0 for guild install | 1 for user install
		.setNSFW(false),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction, client) {

		try {
			// random colors from one dark color palette
			const colors = ['#282C34', '#E06C75', '#98C379', '#E5C07b', '#61AFEF', '#C678DD', '#56B6C2', '#ABB2BF', '#6B859E', '#3890E9', '#A359ED', '#EC5252', '#C97016', '#5DA713', '#13AFAF'];
			const color = Math.floor(Math.random() * colors.length);
			const resColor = colors[color];
			// end of the color randomization

			const { options } = interaction;

			const target = options.getUser("target");
			const member = await interaction.guild.members.fetch(target.id).catch(console.error);
			let reason = options.getString("reason");

			if (!reason) reason = "No reason given.";

			const kickEmbed = new EmbedBuilder()
				.setColor(resColor)
				.setTimestamp()

			await target.send({
				content: `${target}`,
				embeds: [kickEmbed.setDescription(`By: ${interaction.member}\nReason: \`\`\`${reason}\`\`\``).setTitle(`You have been kicked from: \`${interaction.guild.name}\``)]
			}).catch();

			await member.kick(reason).catch(console.error);

			const logchannel = await logdb.findOne({ Guild: guild.id });
			if (logchannel) {
				// get the webhook from client
				const webhook = await client.fetchWebhook(logchannel.General.webhookId);
				if (webhook) {
					const logEmbed = new EmbedBuilder()
						.setTitle(`has been kicked from the server.`)
						.setDescription(`By: ${interaction.member}\nReason: \`\`\`${reason}\`\`\``)
						.setTimestamp()

					webhook.send({ content: `${target}`, embeds: [logEmbed] });
				}
			}

			interaction.reply({ embeds: [kickEmbed.setDescription(`${target} as been kicked from the server successfully ✅`).setTitle(`Has been kicked from the server.`)], ephemeral: true });
		} catch (err) {
			console.log(err);
		}
	}
}
