const { EmbedBuilder, SlashCommandBuilder, Colors } = require('discord.js');
module.exports = {
	name: "help",
	description: "Gives you help.",
	permission: "`SEND_MESSAGES`",
	usage: "`/help`",
	type: "Other",
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Gives you help :)')
		.setContexts(0, 1, 2) // 0 for guild | 1 for botDM | 2 everywhere
		.setIntegrationTypes(0, 1) // 0 for guild install | 1 for user install
		.setNSFW(false),
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
					value: "</commands:1222174029813776518>"
				}, {
					name: 'If you need any extra help or have any question feel free to join YourBestBOT\'s support server using:',
					value: "</support:1222174029813776522> or click [here](https://discord.gg/uaZjU2pdVd)"
				}, {
					name: 'Invite me to your server using:',
					value: '</bot:1222174029813776517>'
				},)
			await interaction.reply({ embeds: [embed] })
		} catch (error) {
			console.log(error)
		}
	}
}