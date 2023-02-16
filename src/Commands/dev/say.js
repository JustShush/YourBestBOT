const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
	name: "say",
	developer: true,
	data: new SlashCommandBuilder()
		.setName("say")
		.setDescription("Make YourBestBot say something.")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addStringOption((option) => option
			.setName("channel")
			.setRequired(true)
			.setDescription(`The channel id`))
		.addStringOption((option) => option
			.setName("msg")
			.setRequired(true)
			.setDescription("The msg you want to say.")),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	execute(interaction, client) {

		const { options } = interaction;

		const channelId = options.getString("channel");
		const msg = options.getString("msg");

		const channel = interaction.guild.channels.cache.get(channelId);
		if (!channel) interaction.reply({ content: "I wasn't able to send a message to that channel.", ephemeral: true });

		channel.send({ content: msg})
		console.log(`${interaction.user.id} ${interaction.user.tag} has sent \`${msg}\` to ${channel.name}.`.green);
	}
}
