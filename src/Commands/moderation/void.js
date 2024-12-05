const color = require('colors');
const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const db = require("../../schemas/Infractions");
const logdb = require("../../schemas/log");

module.exports = {
	name: "void",
	description: "Remove an Infraction from a member.",
	permission: "`MEDERATE_MEMBERS`",
	usage: "`/void <member> <caseId>`",
	type: "Moderation 🛠️",
	data: new SlashCommandBuilder()
		.setName("void")
		.setDescription("Remove a warn from someone")
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
		.addUserOption(options => options
			.setName("target")
			.setDescription("Select the target member.")
			.setRequired(true)
		)
		.addStringOption(options => options
			.setName("id")
			.setDescription("The id of the warn to void.")
			.setRequired(true)
			.setMaxLength(512)
		)
		.setContexts(0)
		.setIntegrationTypes(0),
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

		const target = options.getMember("target");
		let id = options.getString("id") - 1;

		let userData = await db.findOne({
			Guild: guild.id,
			User: target.id
		});

		if (!userData)
			userData = await db.create({
				GuildName: interaction.guild.name,
				Guild: guild.id,
				User: target.id,
				UserTag: target.user.tag,
				Infractions: []
			});

		if (!userData.Infractions.length) return await interaction.reply({ content: `This member doesnt have any Infractions.`, ephemeral: true });
		if (!userData.Infractions[id]) return await interaction.reply({ content: `Thats an invalid Case number!`, ephemeral: true });

		const newEmbed = new EmbedBuilder()
			.setColor(resColor)
			.setDescription(`By: <@${userData.Infractions[id].IssuerID}>\nReason: \`\`\`${userData.Infractions[id].Reason}\`\`\`\nbringing your infractions total to **${userData.Infractions.length - 1} points**.`)
			.setTimestamp()

		await interaction.reply({
			content: `${target}`,
			embeds: [newEmbed.setTitle(`Voided Case (${id + 1})`)]
		});

		const logchannel = await logdb.findOne({ Guild: guild.id });
		if (logchannel) {
			// get the webhook from client
			const webhook = await client.fetchWebhook(logchannel.General.webhookId);
			if (webhook) {
				const logEmbed = new EmbedBuilder()
					.setTitle(`${interaction.member.displayName} | (${interaction.member.id}) Voided Case (${id + 1})`)
					.setDescription(`By: <@${userData.Infractions[id].IssuerID}>\nReason: \`\`\`${userData.Infractions[id].Reason}\`\`\`\nbringing your infractions total to **${userData.Infractions.length - 1} points**.`)
					.setColor(resColor)
					.setTimestamp()

				webhook.send({ embeds: [logEmbed] });
			}
		}

		userData.Infractions.splice(id, 1);
		await userData.save();

	}
}