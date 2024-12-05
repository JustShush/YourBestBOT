const color = require('colors');
const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const db = require("../../schemas/Infractions");
const logdb = require("../../schemas/log");

module.exports = {
	name: "warnings",
	description: "Get the warnings for a user",
	permission: "`MODERATE_MEMBERS`",
	usage: "`/warnings [member]`",
	type: "Moderation 🛠️",
	data: new SlashCommandBuilder()
		.setName("warnings")
		.setDescription("Get the warnings for a user")
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
		.setDMPermission(false)
		.addUserOption(options => options
			.setName("user")
			.setDescription("User to get the warning for")
			.setRequired(true)
		)
		.setDMPermission(false)
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

		const target = options.getMember("user");
		const User = options.getUser("user");
		let reason = options.getString("reason");

		if (!reason) reason = "No reason given.";

		const errorsArray = [];
		const errorsEmbed = new EmbedBuilder()
			.setAuthor({ name: "Could not timeout member due to:" })
			.setColor("Red")

		if (!target) return interaction.reply({
			embeds: [errorsEmbed.setDescription("Member has most likely left the guild.")],
			ephemeral: true
		})

		if (errorsArray.length) return interaction.reply({
			embeds: [errorsEmbed.setDescription(errorsArray.join("\n"))],
			ephemeral: true
		})

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
		else {
			const nbr = userData.Infractions.length;
			if (nbr <= 0) return interaction.reply({ content: "There are no warnings for this user.", ephemeral: true });
			const newEmbed = new EmbedBuilder()
				.setColor("Red")
				.setAuthor({ name: `${nbr} for ${User.username} (${User.id})`, iconURL: User.displayAvatarURL()})
			let i = 1;
			userData.Infractions.forEach((w) => {
				newEmbed.addFields({ name: `Case ${i}\n**Moderator: ${w.IssuerTag}** | ${w.IssuerID}`, value: `${w.Reason} - <t:${w.Date}:R>`})
				i++;
			})

			interaction.reply({ embeds: [newEmbed] });
		}

	}
}