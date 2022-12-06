const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	name: "wel",
	data: new SlashCommandBuilder()
		.setName('wel')
		.setDescription('Welcome new members.'),
	async execute(interaction, client) {
		await interaction.reply({ content: `<a:welcome1:980060584173244487><a:welcome2:980060584122941450> to **${interaction.guild.name}**!! Make sure to read the rules to get started <a:crumbdance:829874949162008597> \n> *~ From <@${interaction.user.id}> ~*` });
	}
}