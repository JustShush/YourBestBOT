const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	name: "rickroll",
	description: "Use this link to rickroll your friends. 🤫",
	permission: "`SEND_MESSAGES`",
	usage: "`/rickroll`",
	type: "Fun",
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