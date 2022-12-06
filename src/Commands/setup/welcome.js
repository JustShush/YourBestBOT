const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const welcomeSchema = require('../../schemas/welcome');

module.exports = {
	name: "welcome",
	data: new SlashCommandBuilder()
		.setName("setup-welcome")
		.setDescription("Set the greetings embed.")
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ManageGuild, PermissionFlagsBits.ViewAuditLog)
		.addChannelOption((option) => option
			.setName("channel")
			.setDescription("The channel you the welcome message to appear.(put it\'s id here)")
			.setRequired(true)
		)
		.addStringOption((option) => option
			.setName("msg")
			.setDescription("The welcome message.")
			.setRequired(true)
		)
		.addRoleOption((option) => option
			.setName("role")
			.setDescription("The default role.(put it\'s id here)")
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
		const Channel = options.getChannel("channel");
		const welcomeMSG = options.getString("msg");
		let Role = options.getRole("role");
		let i = 1;
		if (!Role) {
			Role = "";
			i = 0;
		}

		let welcomeRes = await welcomeSchema.findOne({
			Guild: interaction.guild.id,
		});

		if (!welcomeRes) {
			welcomeRes = await welcomeSchema.create({
				GuildName: interaction.guild.name,
				Guild: interaction.guild.id,
				User: interaction.user.id,
				UserTag: interaction.user.tag,
				Channel: Channel.id,
				MSG: welcomeMSG,
				Role: Role.id,
			})
		} else {
			welcomeRes.GuildName = interaction.guild.name,
			welcomeRes.Guild = interaction.guild.id,
			welcomeRes.User = interaction.user.id,
			welcomeRes.UserTag = interaction.user.tag,
			welcomeRes.Channel = Channel.id,
			welcomeRes.MSG = welcomeMSG,
			welcomeRes.Role = Role.id
		}
		welcomeRes.save();

		const welcomeEmbed = new EmbedBuilder()
			.setColor(resColor)
			.setTimestamp()

		if (i == 1)
			interaction.reply({ embeds: [welcomeEmbed.setDescription(`✅ Welcome message has been setup.\nChannel: ${Channel} \nMessage: \`${welcomeMSG}\`✅\nRole: ${Role}`)], ephemeral: true });
		else
			interaction.reply({ embeds: [welcomeEmbed.setDescription(`✅ Welcome message has been setup.\nChannel: ${Channel} \nMessage: \`${welcomeMSG}\`✅\nRole: \`No role given\`.`)], ephemeral: true });
	}
}
