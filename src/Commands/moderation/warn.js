const color = require('colors');
const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const db = require("../../schemas/Infractions");
const logdb = require("../../schemas/log");

module.exports = {
	name: "warn",
	description: "Warn a member.",
	permission: "`MODERATE_MEMBERS`",
	usage: "`/warn [member], /warn [member] [reason]`",
	type: "Moderation 🛠️",
	data: new SlashCommandBuilder()
		.setName("warn")
		.setDescription("Warn a member.")
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
		.setDMPermission(false)
		.addUserOption(options => options
			.setName("target")
			.setDescription("Select the target member.")
			.setRequired(true)
		)
		.addStringOption(options => options
			.setName("reason")
			.setDescription("Provide a reson for this warn.")
			.setMaxLength(512)
		)
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

		const { options, guild, member } = interaction;

		const target = options.getMember("target");
		const User = options.getUser("target");
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

		//if (!target.manageable || !target.moderatable)
		//	errorsArray.push("Selected target is not moderatable by the bot.")

		//if (member.roles.highest.position < target.roles.highest.position)
		//	errorsArray.push("Selected member has a higher role position than you.")

		if (errorsArray.length) return interaction.reply({
			embeds: [errorsEmbed.setDescription(errorsArray.join("\n"))],
			ephemeral: true
		})

		const warnObj = {
			IssuerID: member.id,
			IssuerTag: member.user.tag,
			Reason: reason,
			Date: Math.floor(new Date().getTime() / 1000)
		}

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
				Infractions: [warnObj]
			});
		else
			userData.Warns.push(warnObj) && await userData.save();

		const newEmbed = new EmbedBuilder()
			.setColor(resColor)
			.setDescription(`By: ${interaction.member}\nReason: \`\`\`${reason}\`\`\``)
			.setTimestamp()

		try {
			await User.send({
				content: `${target}`,
				embeds: [newEmbed.setTitle(`You have been warned on: \`${interaction.guild.name}\``)]
			});
		} catch (err) {
			console.log(err);
		}

		const logchannel = await logdb.findOne({ Guild: guild.id });
		if (logchannel) {
			// get the webhook from client
			const webhook = await client.fetchWebhook(logchannel.General.webhookId);
			if (webhook) {
				const logEmbed = new EmbedBuilder()
					.setTitle(`has been warned.`)
					.setDescription(`By: ${interaction.member}\nReason: \`\`\`${reason}\`\`\``)
					.setTimestamp()

				webhook.send({ content: `${target}`, embeds: [logEmbed] });
			}
		}

		return interaction.reply({
			content: `${target}`,
			embeds: [newEmbed.setTitle("You have been Warned!")]
		});

	}
}