const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const jobsChecker = require("../../schemas/job_checker");
const EconomyChecker = require("../../schemas/economy_checker");

module.exports = {
	name: "work-resign",
	description: "Resign from your current job.",
	permission: "`SEND_MESSAGES`",
	usage: "`/work-resign`",
	type: "Economy 💸",
	data: new SlashCommandBuilder()
		.setName('work-resign')
		.setDescription('Resign from your current job.')
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
					UserTag: interaction.user.tag
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

			if (userData.Profession == undefined) return interaction.reply({ embeds: [new EmbedBuilder().setTitle(`You are unemployed!`).setDescription(`||Quick question:\nDo you have alzheimer?!?!||`)]});

			let  worked = "";
			jobData.Jobs.forEach(job => {
				worked = job.Profession;
			});

			const embed = new EmbedBuilder()
				.setTitle(`${interaction.user.username} you are no longer working has a \`${jobData.Jobs[userData.Profession].Profession}\``)
				.setColor("#2f3136")
				.setDescription(`You are now unemployed. Shame on you!`)
				.setFooter({ text: `Requested by ${interaction.user.tag}` })
				.setTimestamp();

			userData.Profession = undefined;

			interaction.reply({
				embeds: [embed],
			});
			await jobData.save();
			await userData.save();

		} catch (error) {
			console.log(error)
		}
	}
} // I need to finish this left it in the beginning.