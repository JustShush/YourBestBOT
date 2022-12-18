const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const EconomyChecker = require("../../schemas/economy_checker");
const JobChecker = require("../../schemas/job_checker");

module.exports = {
	name: "work shift",
	data: new SlashCommandBuilder()
		.setName('work-shift')
		.setDescription('Work to get some coins.'),
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
					work_cooldown: 0,
					work_last_worked: 0,
				});
			}

			const jobData = await JobChecker.findOne({
				Guild: interaction.guild.id,
			});
			if (!jobData) {
				await JobChecker.create({
					GuildName: interaction.guild.name,
					Guild: interaction.guild.id,
					User: interaction.user.id,
					UserTag: interaction.user.tag,
					Jobs: []
				});
			}

			if (Math.floor(Date.now() / 1000) <= userData.work_cooldown) {
				return interaction.reply({
					embeds: [
						new EmbedBuilder()
							.setAuthor({ name: `Cooldown` })
							.setDescription(`You are currently on cooldown! You can work again at <t:${userData.work_cooldown}>.`)
							.setColor(resColor),
					],
					ephemeral: true
				});
			} else if (Math.floor(Date.now() / 1000 >= userData.work_last_worked + 172800)) { // 48 hours
				userData.work_last_worked = 0;
				await userData.save();
			}

			coins = jobData.Jobs[userData.Profession].Salary

			interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setAuthor({ name: `Great Work!` })
						.setColor(resColor)
						.addFields({ name: `You were given:`, value: `\`${coins}\` for your shift. Has a **${jobData.Jobs[userData.Profession].Profession}**`, inline: true }, { name: '\u200B', value: '\u200B', inline: true }, { name: '\u200B', value: '\u200B', inline: true })
						.setFooter({ text: `You worked has a ${jobData.Jobs[userData.Profession].Profession}` })
				],
			});
			const cooldown = Math.floor(Date.now() / 1000 + 3600); // 1 hour cooldown
			const new_balance = Math.floor(coins + userData.balance);
			userData.balance = new_balance;
			userData.work_cooldown = cooldown;
			userData.work_last_worked = Math.floor(Date.now() / 1000);
			await userData.save();

		} catch (error) {
			console.log(error)
		}
	}
}