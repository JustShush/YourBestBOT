const { EmbedBuilder, SlashCommandBuilder} = require('discord.js');

module.exports = {
	name: "songs",
	data: new SlashCommandBuilder()
		.setName('songs')
		.setDescription('All the songs made by Midwell'),
	async execute(interaction, client) {
		try {

			// random colors from one dark color palette 
			const colors = ['#282C34', '#E06C75', '#98C379', '#E5C07b', '#61AFEF', '#C678DD', '#56B6C2', '#ABB2BF', '#6B859E', '#3890E9', '#A359ED', '#EC5252', '#C97016', '#5DA713', '#13AFAF'];
			const color = Math.floor(Math.random() * colors.length);
			const resColor = colors[color];
			// end of the color randomization 

			const embed = new EmbedBuilder()
				.setColor(resColor)
				.setTitle('**Here is the list of the songs.**')
				.addFields({
					name: 'T.S.O.M.E.C. - Mildwell',
					value: '[Click here](https://www.youtube.com/watch?v=kyjQcn43D3Q)'
				}, {
					name: 'Let me make you happy - Mildwell',
					value: '[Click here](https://youtu.be/ACsMshANte0)'
				})
			await interaction.reply({ embeds: [embed] })
		} catch (error) {
			console.log(error)
		}
	}
}