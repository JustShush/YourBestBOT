// https://portal.thatapicompany.com/
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios')

module.exports = {
	name: "dog",
	description: "Get random dog images.",
	permission: "`SEND_MESSAGES`",
	usage: "`/dog`",
	type: "Fun 🤪",
	data: new SlashCommandBuilder()
		.setName('dog')
		.setDescription('Get random dog images.')
		.setContexts(0, 1, 2) // 0 for guild | 1 for botDM | 2 everywhere
		.setIntegrationTypes(0, 1) // 0 for guild install | 1 for user install
		.setNSFW(false),
	async execute(interaction) {

		const res = await axios.get('https://api.thedogapi.com/v1/images/search');
		if (res.status != 200) return interaction.reply({ content: `Something went wrong when fetching the Dogs \<3\nIf possible join the support server and send us a report there pls \<3 https://discord.gg/${interaction.client.config.support}`, ephemeral: true });

		const imgUrl = res.data[0].url;

		const embed = new EmbedBuilder()
			.setTitle("Dog")
			.setURL(`${imgUrl}`)
			.setColor(`#${interaction.client.config.pretty.embed}`)
			.setImage(`${imgUrl}`)

		await interaction.reply({ embeds: [embed] })
	}
}