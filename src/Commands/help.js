const { EmbedBuilder, SlashCommandBuilder, Colors } = require('discord.js');
module.exports = {
	anme: "help",
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Gives you help :)'),
	async execute(interaction, client) {
		try {
			// random colors from one dark color palette 
			const colors = ['#282C34', '#E06C75', '#98C379', '#E5C07b', '#61AFEF', '#C678DD', '#56B6C2', '#ABB2BF', '#6B859E', '#3890E9', '#A359ED', '#EC5252', '#C97016', '#5DA713', '#13AFAF'];
			const color = Math.floor(Math.random() * colors.length);
			const resColor = colors[color];
			// end of the color randomization 

			const embed = new EmbedBuilder()
				.setColor(resColor)
				.setTitle('**Help Menu**')
				.addFields({
					name: 'See all the commands using:',
					value: "</commands:1052662424718815282>"
				}, {
					name: 'If you need any extra help or have any question feel free to join YourBestBOT\'s support server using:',
					value: "</support:1052662424790106150> or click [here](https://discord.gg/uaZjU2pdVd)"
				}, {
					name: 'Invite me to your server using:',
					value: '</bot:1052662424790106148>'
				},)
			await interaction.reply({ embeds: [embed] })
		} catch (error) {
			console.log(error)
		}
	}
}