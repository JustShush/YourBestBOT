const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const EconomyChecker = require("../../schemas/economy_checker");
const jobsChecker = require("../../schemas/job_checker");

module.exports = {
	name: "jobs rm",
	data: new SlashCommandBuilder()
		.setName('jobs-remove')
		.setDescription('Add jobs to the server.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addNumberOption(option => option
			.setName("number")
			.setDescription("The number of the work.")
			.setRequired(true)),
	async execute(interaction, client) {
		try {

			const { options } = interaction

			let Number = options.getNumber("number");

			if (Number < 1 || Number > 5) return interaction.reply({ content: `**Invalied input!**\nThere is no job with that number.Please verify the numbers of the jobs by running the command </work-list:1052682873158770869>`, ephemeral: true });

			const userData = await EconomyChecker.findOne({
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
				.setTitle(`${interaction.user.username} you have removed \`${jobData.Jobs[Number - 1].Profession}\` to the list of jobs.`)
				.setColor("#2f3136")
				.setDescription(`d`)
				.setFooter({ text: `Requested by ${interaction.user.tag}` })
				.setTimestamp();

			jobData.Jobs = jobData.Jobs.filter((Job, index) => { return index !== Number - 1})
			jobsChecker.deleteOne({ Jobs: jobData.Jobs[Number - 1] })

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