const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const EconomyChecker = require("../../schemas/economy_checker");
const jobsChecker = require("../../schemas/job_checker");

module.exports = {
	name: "work list",
	data: new SlashCommandBuilder()
		.setName('work-list')
		.setDescription('Work to get some coins.'),
	async execute(interaction, client) {
		try {

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

			const jobData = await jobsChecker.findOne({
				Guild: interaction.guild.id
			});
			if (!jobData) {
				await jobsChecker.create({
					GuildName: interaction.guild.name,
					Guild: interaction.guild.id,
					User: interaction.user.id,
					UserTag: interaction.user.tag,
					Jobs: []
				});
			}

			const embed = new EmbedBuilder()
				.setAuthor({ name: `Available Jobs!` })
				.setColor("#2f3136")
				.setFooter({ text: `Requested by ${interaction.user.tag}` })
				.setTimestamp();

			let i = 1;
			if (!jobData.Jobs[0]) return interaction.reply({ content: "This server doesn\'t have any jobs available please run </jobs:1052689735543435349> to add a new job."})
			jobData.Jobs.forEach(job => {
				embed.addFields({ name: `${i++}: ${job.Profession}`, value: `<:bt1:1053728427879977050> Time Between Shifts: \`${job.Cooldown}\` minutes.\n<:bt2:1053728398586941572> Salary: \`${job.Salary} per shift\`` })
			});

			interaction.reply({
				embeds: [embed],
			});
			await jobData.save();
			await userData.save();
		} catch (error) {
			console.log(error)
		}
	}
}