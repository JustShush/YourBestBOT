const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const jobsChecker = require("../../schemas/job_checker");
const EconomyChecker = require("../../schemas/economy_checker");

module.exports = {
	name: "work apply",
	data: new SlashCommandBuilder()
		.setName('work-apply')
		.setDescription('Start working.')
		.addNumberOption(option => option
			.setName("job")
			.setDescription("Set the job you want to work on.")
			.setRequired(true)),
	async execute(interaction, client) {
		try {

			const { options } = interaction

			const Job = options.getNumber("job");

			const jobData = await jobsChecker.findOne({
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

			const userData = await EconomyChecker.findOne({
				Guild: interaction.guild.id,
				User: interaction.user.id,
			});
			if (!userData) {
				userData = await EconomyChecker.create({
					GuildName: interaction.guild.name,
					Guild: interaction.guild.id,
					User: interaction.user.id,
					UserTag: interaction.user.tag
				});
			}

			if (Job < 1 || Job > 5) return interaction.reply({ content: `Invalid number for the job. Please choose a number between \`1\` and \`5\`.` });
			if (!userData.Profession) userData.Profession = Job - 1;
			if (userData.Profession == Job - 1) return interaction.reply({ embeds: [new EmbedBuilder().setTitle(`You already have a job has a \`${jobData.Jobs[userData.Profession].Profession}\``).setDescription(`||Quick question:\nDo you have alzheimer?!?!||`).setColor("#2f3136")] });

			const embed = new EmbedBuilder()
				.setTitle(`${interaction.user.username} you are now working has a \`${jobData.Jobs[Job - 1].Profession}\``)
				.setColor("#2f3136")
				.setDescription(`:thumbsup:`)
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