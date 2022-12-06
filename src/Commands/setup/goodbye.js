const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, PermissionsBitField } = require("discord.js");
const byeSchema = require('../../schemas/goodbye');

module.exports = {
	name: "goodbye",
	data: new SlashCommandBuilder()
		.setName("setup-goodbye")
		.setDescription("Set the greetings embed.")
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ManageGuild, PermissionFlagsBits.ViewAuditLog, PermissionsBitField.ViewGuildInsights)
		.addStringOption((option) => option
			.setName("channel")
			.setDescription("The channel to the GoodBye message to appear.(put it\'s id here)")
			.setRequired(true)
		)
		.addStringOption((option) => option
			.setName("msg")
			.setDescription("The GoodBye message.")
			.setRequired(true)
		),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction, client) {

		// random colors from one dark color palette 
		const colors = ['#282C34', '#E06C75', '#98C379', '#E5C07b', '#61AFEF', '#C678DD', '#56B6C2', '#ABB2BF', '#6B859E', '#3890E9', '#A359ED', '#EC5252', '#C97016', '#5DA713', '#13AFAF'];
		const color = Math.floor(Math.random() * colors.length);
		const resColor = colors[color];
		// end of the color randomization

		const { options } = interaction; // so that i dont need to do interaction.options all the time

		const member = await interaction.guild.members.fetch(interaction.user.id).catch(console.error);
		const Channel = options.getString("channel");
		const byeMSG = options.getString("msg");

		let byeRes = await byeSchema.findOne({
			Guild: interaction.guild.id,
		});

		if (!byeRes) {
			byeRes = await byeSchema.create({
				GuildName: interaction.guild.name,
				Guild: interaction.guild.id,
				Channel: Channel,
				MSG: byeMSG,
			});
		} else {
			byeRes.GuildName = interaction.guild.name,
			byeRes.Guild = interaction.guild.id,
			byeRes.Channel = Channel,
			byeRes.MSG = byeMSG
		}
		byeRes.save();

		const byeEmbed = new EmbedBuilder()
			.setColor(resColor)
			.setTimestamp()

		interaction.reply({ embeds: [byeEmbed.setDescription(`✅ Welcome message has been setup.\nChannel: ${Channel} \nMessage: \`${byeMSG}\`✅`)], ephemeral: true });
	}
}
