const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const EconomyChecker = require("../../schemas/economy_checker");

module.exports = {
	name: "daily",
	data: new SlashCommandBuilder()
		.setName('daily')
		.setDescription('Claim your daily coins!'),
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
					ask_cooldown: 0,
					daily_streak: 1
				});
			}

			if (userData.daily_streak === undefined) {
				userData.daily_streak = 1;
				await userData.save();
			}

			if (Math.floor(Date.now() / 1000) <= userData.daily_cooldown) {
				return interaction.reply({
					embeds: [
						new EmbedBuilder()
							.setAuthor({ name: `Cooldown` })
							.setDescription(`You are currently on cooldown! You can only claim the next daily at <t:${userData.daily_cooldown}>.`)
							.setColor(resColor),
					],
					ephemeral: true
				});
			} else if ( Math.floor(Date.now() / 1000 >= userData.daily_last_claimed + 172800) ) {
				userData.daily_streak = 1;
				userData.daily_last_claimed = 0;
				await userData.save();
			}

			const streak_coins = Math.floor(userData.daily_streak * 50);
			interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setAuthor({ name: `Daily Claimed!` })
						.setColor(resColor)
						.setDescription(`YourBestBOT has given you **250 + ${streak_coins}** coins!`)
						.setFooter({ text: `You claimed daily for ${userData.daily_streak} days!`, })
				],
			});
			const new_streak = userData.daily_streak + 1;
			const cooldown = Math.floor(Date.now() / 1000 + 86400);
			const new_balance = Math.floor(streak_coins + 250 + userData.balance);
			userData.balance = new_balance;
			userData.daily_streak = new_streak;
			userData.daily_cooldown = cooldown;
			userData.daily_last_claimed = Math.floor(Date.now() / 1000);
			await userData.save();

		} catch (error) {
			console.log(error)
		}
	}
}