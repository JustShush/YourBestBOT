const { EmbedBuilder, SlashCommandBuilder, Colors } = require('discord.js');
module.exports = {
	name: "support",
	data: new SlashCommandBuilder()
		.setName('support')
		.setDescription('Join YourBestBot\'s support server.'),
	async execute(interaction, client) {
		try {

			// random colors from one dark color palette 
			const colors = ['#282C34', '#E06C75', '#98C379', '#E5C07b', '#61AFEF', '#C678DD', '#56B6C2', '#ABB2BF', '#6B859E', '#3890E9', '#A359ED', '#EC5252', '#C97016', '#5DA713', '#13AFAF'];
			const color = Math.floor(Math.random() * colors.length);
			const resColor = colors[color];
			// end of the color randomization 

			const { member } = interaction

			const embed = new EmbedBuilder()
				.setColor(member.displayHexColor || resColor)
				.setAuthor({ name: 'YourBestBOT', iconURL: 'https://i.imgur.com/GhT4rY2.png', url: 'https://yourbestbot.pt' })
				.setTitle('Thank you for inviting me to your server!')
				.setThumbnail('https://i.imgur.com/GhT4rY2.png') // por a foto do bot aqui depois.
				.addFields({
					name: 'Thank you for helping me grow and reach new palces <3',
					value: '[Click here](https://discord.com/api/oauth2/authorize?client_id=820324857799245855&permissions=8&scope=bot%20applications.commands) to invite me to your server :)',
					inline: true
				})
				.setTimestamp()
				.setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })

			await interaction.reply({ embeds: [embed] })
		} catch (error) {
			console.log(error)
		}
	}
}