const color = require('colors');
const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const db = require("../../schemas/nickSys");

module.exports = {
	name: "nicksys",
	data: new SlashCommandBuilder()
		.setName("setup-nicksys")
		.setDescription("Enable/Disable the nickname System.")
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild, PermissionFlagsBits.ManageChannels),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction) {

		// random colors from one dark color palette
		const colors = ['#282C34', '#E06C75', '#98C379', '#E5C07b', '#61AFEF', '#C678DD', '#56B6C2', '#ABB2BF', '#6B859E', '#3890E9', '#A359ED', '#EC5252', '#C97016', '#5DA713', '#13AFAF'];
		const color = Math.floor(Math.random() * colors.length);
		const resColor = colors[color];
		// end of the color randomization

		const { guild, member } = interaction;

		let data = await db.findOne({
			Guild: guild.id,
			User: member.id,
			UserTag: interaction.user.tag,
		});

		if (!data)
			data = await db.create({
				GuildName: interaction.guild.name,
				Guild: guild.id,
				User: member.id,
				UserTag: interaction.user.tag,
				Nicksys: false
			});
		else
			await data.save();

		const newEmbed = new EmbedBuilder()
			.setAuthor({ name: "Nickname System" })
			.setColor(interaction.guild.members.me.displayHexColor || "DARK_RED")
			.setFooter({ text: `Requested by ${interaction.user.tag}` })
			.setTimestamp()

		if (data.Nicksys === true) {
			interaction.reply({
				embeds: [newEmbed.setDescription("Nickname System has been **disabled**.")],
			});
			data.Nicksys = false;
			await data.save();
		} else if (data.Nicksys === false) {
			interaction.reply({
				embeds: [newEmbed.setDescription("Nickname System has been **enabled**.")],
			});
			data.Nicksys = true;
			await data.save();
		} else {
			interaction.reply({
				embeds: [newEmbed.setDescription("Nickname System has been **enabled.**")],
			});
			data.Nicksys = true;
			await data.save();
		}
	}
}