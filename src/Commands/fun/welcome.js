const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	name: "welcome",
	description: "Welcome the new members with a cool msg.",
	permission: "`SEND_MESSAGES`",
	usage: "`/welcome`",
	type: "Fun 🤪",
	data: new SlashCommandBuilder()
		.setName('welcome')
		.setDescription('Welcome new members.')
		.setDMPermission(true)
		.setNSFW(false),
	async execute(interaction) {
		await interaction.reply({ content: `<a:welcome1:980060584173244487><a:welcome2:980060584122941450> to **${interaction.guild.name}**!! Make sure to read the rules to get started <a:crumbdance:829874949162008597> \n> *~ From <@${interaction.user.id}> ~*` });
	}
}