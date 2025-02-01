const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const EconomyChecker = require("../../schemas/economy_checker");
const jobsChecker = require("../../schemas/job_checker");

module.exports = {
	name: "jobs-add",
	description: "Create a new job.",
	permission: "`ADMINISTRATOR`",
	usage: "`/jobs-add [job_name] [cooldown] [salary]`",
	type: "Economy 💸",
	data: new SlashCommandBuilder()
		.setName('jobs-add')
		.setDescription('Add jobs to the server.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addStringOption(option => option
			.setName("job")
			.setDescription("Set the job\'s name.")
			.setRequired(true))
		.addNumberOption(option => option
			.setName("time")
			.setDescription("Set the cooldwon of this shift.(in minutes)")
			.setRequired(true))
		.addNumberOption(option => option
			.setName("salary")
			.setDescription("Set the salary per shift.")
			.setRequired(true))
		.setContexts(0) // 0 for guild | 1 for botDM | 2 everywhere
		.setIntegrationTypes(0) // 0 for guild install | 1 for user install
		.setNSFW(false),
	async execute(interaction, client) {
		try {

			const { options } = interaction

			const Job = options.getString("job");
			let Time = options.getNumber("time");
			let Salary = options.getNumber("salary");

			if (!isNaN(Job)) return interaction.reply({ content: `Make sure the Job name isnt just numbers.`, ephemeral: true });
			if (Time <= 10) return interaction.reply({ content: `Make sure the job cooldown is higher then 10 minutes.`, ephemeral: true });
			if (Salary > 100000) return interaction.reply({ content: `Make sure the job Salary is not higher then 100k.`, ephemeral: true });

			let userData = await EconomyChecker.findOne({
				Guild: interaction.guild.id
			});
			if (!userData) {
				userData = await EconomyChecker.create({
					GuildName: interaction.guild.name,
					Guild: interaction.guild.id,
					User: interaction.user.id,
					UserTag: interaction.user.tag,
				});
			}

			const jobObj = {
				Profession: Job,
				Cooldown: Time,
				Salary: Salary
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
					Jobs: [jobObj]
				});
			} else
				jobData.Jobs.push(jobObj);

			let i = 0;
			while (jobData.Jobs[i] != null)
				i++;
			if (i > 5) return interaction.reply({ content: `This server has reached the maximum amount of jobs. \`5\`` });

			const embed = new EmbedBuilder()
				.setTitle(`${interaction.user.username} you have added \`${Job}\` to the list of jobs.`)
				.setColor("#2f3136")
				.setDescription(`This job has been set to a **Cooldown** of: \`${Time}\`minutes and a **Salary** of: \`${Salary}\` Coins.\nIf you want to see all the jobs do </work-list:1222174027787931684>`)
				.setFooter({ text: `Requested by ${interaction.user.tag}` })
				.setTimestamp();

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