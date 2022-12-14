const { EmbedBuilder, SlashCommandBuilder, Embed } = require('discord.js');
const EconomyChecker = require("../../schemas/economy_checker");

module.exports = {
	name: "search",
	data: new SlashCommandBuilder()
		.setName('search')
		.setDescription('Search for coins.'),
	async execute(interaction, client) {
		try {

			// random colors from one dark color palette 
			const colors = ['#282C34', '#E06C75', '#98C379', '#E5C07b', '#61AFEF', '#C678DD', '#56B6C2', '#ABB2BF', '#6B859E', '#3890E9', '#A359ED', '#EC5252', '#C97016', '#5DA713', '#13AFAF'];
			const color = Math.floor(Math.random() * colors.length);
			const resColor = colors[color];
			// end of the color randomization

			const userData = await EconomyChecker.findOne({
				Guild: interaction.guild.id,
				User: interaction.user.id,
			});
			if (!userData) {
				await EconomyChecker.create({
					GuildName: interaction.guild.name,
					Guild: interaction.guild.id,
					User: interaction.user.id,
					UserTag: interaction.user.tag,
					balance: 0,
					search_cooldown: 0
				});
			}

			const coins = Math.floor(Math.random() * 150);
			if (Math.floor(Date.now() / 1000) <= userData.search_cooldown) {
				return interaction.reply({
					embeds: [
						new EmbedBuilder()
							.setAuthor({ name: `Cooldown` })
							.setDescription(`You are currently on cooldown! You can only ask for money again at <t:${userData.search_cooldown}:T>.`)
							.setColor(resColor),
					],
					ephemeral: true,
				});
			}
			if (coins < 30) {
				interaction.reply({
					embeds: [
						new EmbedBuilder()
							.setAuthor({ name: `No coins found` })
							.setDescription("What did you expect? You tried searching behind a police station's dumpster. You were luck you were not arrested.")
							.setColor(resColor)
							.setFooter({ text: `Requested by ${interaction.user.tag}` })
							.setTimestamp(),
					],
				});
				const cooldown = Math.floor(Date.now() / 1000 + 30); // 30 sec cooldown
				userData.User = interaction.user.id;
				userData.search_cooldown = cooldown;
				await userData.save();
			} else {
				interaction.reply({
					embeds: [
						new EmbedBuilder()
							.setColor(resColor)
							.setDescription(`You dig up an old time capsule someone buried in their front yard a few years ago, you find ${coins} inside, noice!`)
							.setFooter({ text: `Requested by ${interaction.user.tag}` })
							.setTimestamp(),
					],
				});
				const new_balance = Math.floor(userData.balance + coins);
				const cooldown = Math.floor(Date.now() / 1000 + 120); // 2 min cooldown
				userData.User = interaction.user.id;
				userData.search_cooldown = cooldown;
				userData.balance = new_balance;
				await userData.save();
			}

		} catch (error) {
			console.log(error)
		}
	}
}