const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const EconomyChecker = require("../../schemas/economy_checker");
const jobsChecker = require("../../schemas/job_checker");

module.exports = {
	name: "work-list",
	description: "View all available jobs.",
	permission: "`SEND_MESSAGES`",
	usage: "`/work-list`",
	type: "Economy 💸",
	data: new SlashCommandBuilder()
		.setName('work-list')
		.setDescription('Work to get some coins.')
		.setContexts(0) // 0 for guild | 1 for botDM | 2 everywhere
		.setIntegrationTypes(0) // 0 for guild install | 1 for user install
		.setNSFW(false),
	async execute(interaction, client) {
		try {

			let userData = await EconomyChecker.findOne({
				Guild: interaction.guild.id,
				User: interaction.user.id,
			});
			if (!userData) {
				userData = await EconomyChecker.create({
					GuildName: interaction.guild.name,
					Guild: interaction.guild.id,
					User: interaction.user.id,
					UserTag: interaction.user.tag,
					balance: 0,
					work_cooldown: 0,
					work_last_worked: 0,
				});
			}

			let jobData = await jobsChecker.findOne({
				Guild: interaction.guild.id
			});
			if (!jobData) {
				jobData = await jobsChecker.create({
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
			if (!jobData.Jobs[0]) return interaction.reply({ content: "This server doesn\'t have any jobs available please run </jobs-add:1222174027301523505> to add a new job."})
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