const { EmbedBuilder, SlashCommandBuilder, Colors } = require('discord.js');
module.exports = {
	name: "bot",
	data: new SlashCommandBuilder()
		.setName('bot')
		.setDescription('Info about YourBestBOT'),
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
				.setTitle('Hi! I see that you want to learn more about me :)')
				.setDescription(`I\`m a multi-purpose discord bot full of tricks so that you enjoy even more your experience here on discord :)\nI want to thank my developer <@453944662093332490> for creating me <3\nFinally I want to thank you all users that play with me all day and night keeping me alive <3<3`)
				.setThumbnail('https://i.imgur.com/GhT4rY2.png') // por a foto do bot aqui depois.
				.addFields({
					name: 'Invitation link:',
					value: '[Click here](https://discord.com/api/oauth2/authorize?client_id=820324857799245855&permissions=8&scope=bot%20applications.commands) to invite me to your server :)',
					inline: true
				},{
					name: 'Vote for YourBestBOT',
					value: '[Click here](https://top.gg/bot/747412110782234654/vote) to vote for me over on Top.gg'
				})
				.setTimestamp()
				.setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })

			await interaction.reply({ embeds: [embed] })
		} catch (error) {
			console.log(error)
		}
	}
}