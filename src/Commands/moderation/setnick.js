const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const logdb = require("../../schemas/log");

module.exports = {
	name: "setnick",
	description: "Change a member's nickname.",
	permission: "`MANAGE_NICKNAMES`",
	usage: "`/setnick [member], /setnick [member] [newNick]`",
	type: "Moderation 🛠️",
	data: new SlashCommandBuilder()
		.setName("setnick")
		.setDescription("Change the nickname of a member.")
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
		.addUserOption((option) => option
			.setName("member")
			.setDescription("The member to change the nickname.")
			.setRequired(true)
		)
		.addStringOption((option) => option
			.setName("name")
			.setDescription("The new new nickname for the member.")
			.setRequired(true)
		)
		.setContexts(0) // 0 for guild | 1 for botDM | 2 everywhere
		.setIntegrationTypes(0) // 0 for guild install | 1 for user install
		.setNSFW(false),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction, client) {

		const { options, guild } = interaction

		const user = options.getUser("member");
		const newnick = options.getString("name");

		user.member.setNickname(newnick);

		const logchannel = await logdb.findOne({ Guild: guild.id })
		if (logchannel) {
			// get the webhook from client
			const webhook = await client.fetchWebhook(logchannel.General.webhookId);
			if (webhook) {
				const logEmbed = new EmbedBuilder()
					.setTitle(`SetNickName`)
					.setDescription(`<@${user}>'s nickname has been set to: \`${newnick}\`\nBy: ${interaction.member}`)
					.setTimestamp()

				webhook.send({ content: `${target}`, embeds: [logEmbed] });
			}
		}

		interaction.reply({ content: `NickName of ${User.tag} has been changed to: ${newnick}`, ephemeral: true });
	}
}
