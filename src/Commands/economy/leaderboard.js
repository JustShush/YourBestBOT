const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const EconomyChecker = require("../../schemas/economy_checker");

module.exports = {
	name: "leaderboard",
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('View the top 10 richest users in this server.'),
	async execute(interaction, client) {
		try {

			// random colors from one dark color palette 
			const colors = ['#282C34', '#E06C75', '#98C379', '#E5C07b', '#61AFEF', '#C678DD', '#56B6C2', '#ABB2BF', '#6B859E', '#3890E9', '#A359ED', '#EC5252', '#C97016', '#5DA713', '#13AFAF', '#ff3067'];
			const color = Math.floor(Math.random() * colors.length);
			const resColor = colors[color];
			// end of the color randomization

			const userData = await EconomyChecker.findOne({ Guild: interaction.guild.id, User: interaction.user.id });

			if (!userData) {
				await EconomyChecker.create({ Guild: interaction.guild.id, User: interaction.user.id, balance: 0 });
				return interaction.reply({ embeds: [new EmbedBuilder().setDescription("You haven't create an account on our bank please run the command again \:).")] });
			}
			var users = await EconomyChecker.find({ Guild: interaction.guild.id }).sort("-balance");
			const array = [];
			let x = 0;
			let yes = false;
			dontAdd = false;
			users.forEach((user) => {
				if (dontAdd == false) {
					array.push(`#${x + 1} | <@!${user.User}> with **${user.balance}** coins.`);
					x++;
				}
				if (user.User == interaction.user.id)
					yes = true
				if (x == 10) dontAdd = true;
			});
			let z = 1;
			shoudStopCount = false;
			users.forEach((user) => {
				if (user.User === interaction.user.id) {
					userPlace = z;
					shoudStopCount = true;
				} else {
					if (shoudStopCount == false) {
						z++;
					}
				}
			});

			const newEmbed = new EmbedBuilder()
				.setDescription(array.join("\n").toString())
				.setAuthor({ name: "Leaderboard" })
				.setColor(resColor)
				.setFooter({ text: `Requested by ${interaction.user.tag}` })
				.setTimestamp()
			
			if (yes == false) {
				newEmbed.addFields({
					name: "Your Position",
					value: ` #${userPlace} | ${interaction.user} with **${userData.balance}** coins.`,
				})
			}

			interaction.reply({
				embeds: [newEmbed],
			});

		} catch (error) {
			console.log(error)
		}
	}
}