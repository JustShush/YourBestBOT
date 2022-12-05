const color = require('colors');
const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, EmbedBuilder, Options } = require("discord.js");
const db = require("../../schemas/Infractions");
const ms = require("ms");

module.exports = {
	name: "timeout",
	permissions: ["KICK_MEMBERS"],
	data: new SlashCommandBuilder()
		.setName("timeout")
		.setDescription("Restrict a member's ability to communicate.")
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
		.setDMPermission(false)
		.addUserOption(options => options
			.setName("target")
			.setDescription("Select the target member.")
			.setRequired(true)
		)
		.addStringOption(options => options
			.setName("duration")
			.setDescription("Provide a duration for this timeout (1m, 1h, 1d)")
			.setRequired(true)
		)
		.addStringOption(options => options
			.setName("reason")
			.setDescription("Provide a reson for this timeout.")
			.setMaxLength(512)
		),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction) {
		const { options, guild, member } = interaction;

		const target = options.getMember("target");
		const duration = options.getString("duration");
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

		if (!ms(duration) || ms(duration) > ms("28d"))
			errorsArray.push("Time provided is invalid or its over the 28 day limit.")

		if (!target.manageable || !target.moderatable)
			errorsArray.push("Selected target is not moderatable by the bot.")

		if (member.roles.highest.position < target.roles.highest.position)
			errorsArray.push("Selected member has a higher role position than you.")

		if (errorsArray.length) return interaction.reply({
			embeds: [errorsEmbed.setDescription(errorsArray.join("\n"))],
			ephemeral: true
		})

		target.timeout(ms(duration), reason).catch((err) => {
			interaction.reply({
				embeds: [errorsEmbed.setDescription("Could not timeout the user due to an uncommin error.")],
				ephemeral: true
			})
			return console.log("Error occured in TimeOut.js".brightRed.bold);
		})

		const newInfractionObj = {
			IssuerID: member.id,
			IssuerTag: member.user.tag,
			Reason: reason,
			Date: Date.now()
		}

		let userData = await db.findOne({
			Guild: guild.id,
			User: target.id,
			UserTag: target.user.tag
		});

		if (!userData)
			userData = await db.create({
				Guild: guild.id,
				User: target.id,
				UserTag: target.user.tag,
				Infractions: [newInfractionObj]
			});
		else
			userData.Infractions.push(newInfractionObj) && await userData.save();

		const successEmbed = new EmbedBuilder()
			.setAuthor({ name: "Timeout issues", icontURL: guild.iconURL() })
			.setColor("Gold")
			.setDescription([
				`You have been timeout for **${ms(ms(duration), { long: true })}** by ${member}`,
				`bringing your infractions total to **${userData.Infractions.length} points**.`,
				`\nReason: ${reason}`
			].join("\n"));

		return interaction.reply({
			content: `${target}`,
			embeds: [successEmbed]
		});


	}
}