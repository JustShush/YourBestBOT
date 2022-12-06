const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	name: "rickroll",
	data: new SlashCommandBuilder()
		.setName('rickroll')
		.setDescription('RickRoll I guess'),
	async execute(interaction, client) {
		try {
			await interaction.reply({ content: 'http://tiny.cc/y8hiuz', ephemeral: true})
		} catch (error) {
			console.log(error)
		}
	}
}