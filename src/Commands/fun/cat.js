// https://portal.thatapicompany.com/
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios')

module.exports = {
	name: "cat",
	description: "Get random cat images.",
	permission: "`SEND_MESSAGES`",
	usage: "`/cat`",
	type: "Fun",
	data: new SlashCommandBuilder()
		.setName('cat')
		.setDescription('Get random cat images.')
		.setDMPermission(true)
		.setNSFW(false),
	async execute(interaction) {

		const res = await axios.get('https://api.thecatapi.com/v1/images/search');
		if (res.status != 200) return interaction.reply({ content: `Something went wrong when fetching the Cats \<3\nIf possible join the support server and send us a report there pls \<3 https://discord.gg/${interaction.client.config.support}`, ephemeral: true });

		const imgUrl = res.data[0].url;

		const embed = new EmbedBuilder()
			.setTitle("Cat")
			.setURL(`${imgUrl}`)
			.setColor(`#${interaction.client.config.pretty.embed}`)
			.setImage(`${imgUrl}`)

		await interaction.reply({ embeds: [embed] })
	}
}