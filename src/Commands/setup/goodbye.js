const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, PermissionsBitField } = require("discord.js");
const byeSchema = require('../../schemas/goodbye');

module.exports = {
	name: "setup-goodbye",
	description: "Setup the goodBye message for when a member leaves the server.",
	permission: "`MANAGE_CHANNELS`, `MANAGE_GUILD`",
	usage: "`/setup-goodbye [channel_id] [msg]`",
	type: "Setup 🔨",
	data: new SlashCommandBuilder()
		.setName("setup-goodbye")
		.setDescription("Set the greetings embed.")
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ManageGuild)
		.addBooleanOption((option) => option
			.setName('status')
			.setDescription('Enable/Disable')
			.setRequired(true)
		)
		.addStringOption((option) => option
			.setName("channel")
			.setDescription("The channel to the GoodBye message to appear.(put it\'s id here)")
			.setRequired(true)
		)
		.addStringOption((option) => option
			.setName("msg")
			.setDescription("The GoodBye message. You can use {member-count} {user-mention} {server-name} {rules}")
			.setRequired(true)
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

		const { options } = interaction; // so that i dont need to do interaction.options all the time

		const member = await interaction.guild.members.fetch(interaction.user.id).catch(console.error);
		const Channel = options.getString("channel");
		const byeMSG = options.getString("msg");
		const status = options.getBoolean('status');

		const byeEmbed = new EmbedBuilder()
			.setColor(resColor)
			.setTimestamp()

		if (!status) {
			await byeSchema.findOneAndDelete({ Guild: interaction.guild.id });
			return await interaction.reply({ embeds: [byeEmbed.setDescription('✅ GoodBye System has be **DISABLED**!')], ephemeral: true });
		}

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

		interaction.reply({ embeds: [byeEmbed.setDescription(`✅ GoodBye message has been setup.\nChannel: ${Channel} \nMessage: \`${byeMSG}\`✅`)], ephemeral: true });
	}
}
