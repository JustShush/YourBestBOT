const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	name: "rickroll",
	description: "Use this link to rickroll your friends. 🤫",
	permission: "`SEND_MESSAGES`",
	usage: "`/rickroll`",
	type: "Fun",
	data: new SlashCommandBuilder()
		.setName('rickroll')
		.setDescription('RickRoll I guess')
		.setContexts(0, 1, 2)
		.setIntegrationTypes(0, 1)
		.setDMPermission(true)
		.setNSFW(false),
	async execute(interaction, client) {
		try {
			await interaction.reply({ content: 'https://youtu.be/dQw4w9WgXcQ?si=UdZBJzwP6WuOPgTN', ephemeral: true})
		} catch (error) {
			console.log(error)
		}
	}
}