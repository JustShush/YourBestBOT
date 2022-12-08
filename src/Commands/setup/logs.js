const color = require('colors');
const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const db = require("../../schemas/log");

module.exports = {
	name: "logs",
	data: new SlashCommandBuilder()
		.setName("setup-logs")
		.setDescription("Set the channel log.")
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild, PermissionFlagsBits.ManageChannels)
		.addStringOption(options => options
			.setName("channel")
			.setDescription("Select the channel log.")
			.setRequired(true)
		),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction) {

		// random colors from one dark color palette
		const colors = ['#282C34', '#E06C75', '#98C379', '#E5C07b', '#61AFEF', '#C678DD', '#56B6C2', '#ABB2BF', '#6B859E', '#3890E9', '#A359ED', '#EC5252', '#C97016', '#5DA713', '#13AFAF'];
		const color = Math.floor(Math.random() * colors.length);
		const resColor = colors[color];
		// end of the color randomization

		const { options, guild, member } = interaction;

		const Channel = options.getString("channel");
		//console.log("Channel: " + Channel + "ChannelId: " + ChannelId);

		const errorsArray = [];
		const errorsEmbed = new EmbedBuilder()
			.setAuthor({ name: "Could not timeout member due to:" })
			.setColor("Red")

		if (!interaction.guild.channels.cache.get(Channel))
			errorsArray.push("That Channel is not in this guild!");

		if (errorsArray.length) return interaction.reply({
			embeds: [errorsEmbed.setDescription(errorsArray.join("\n"))],
			ephemeral: true
		})

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
				Channel: Channel
			});
		else
			await data.save();

		const newEmbed = new EmbedBuilder()
			.setColor(resColor)
			.setDescription(`✅ Logs Channel has been setup.\nChannel: \`${Channel}\``)
			.setTimestamp()

		return interaction.reply({
			embeds: [newEmbed],
			ephemeral: true
		});

	}
}