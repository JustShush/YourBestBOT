const { ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');
module.exports = {
	name: "clear",
	permissions: [],
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Clear messages.')
		.addNumberOption((option) => option
			.setName("amount")
			.setDescription("The amount of messages to delete.(max 100)")
			.setRequired(true)),
	/**
	* @param {ChatInputCommandInteraction} interaction
	*/
	async execute(interaction, client) {
		try {

			const { options } = interaction

			const n = options.getNumber("amount");
			if (n >= 100) return interaction.reply({ content: "You can't remove more than 100 mesages!" });
			if (n < 1) return interaction.reply({ content: "You have to delete at least 1 message!" });

			interaction.channel.messages.fetch({
				limit: n
			}).then(msg => {
				interaction.channel.bulkDelete(msg)
			})

			await interaction.reply({ content: `You have deleted ${n} messages succesfully.`, ephemeral: true })
		} catch (error) {
			console.log(error)
		}
	}
}