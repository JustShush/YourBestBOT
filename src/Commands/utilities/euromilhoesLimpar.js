const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const euroMilhoesModel = require('../../schemas/euroMilhoes');
const euroMilhoesStatsModel = require('../../schemas/euroMilhoesStats'); // Add this import

module.exports = {
	name: "euromilhoes-limpar",
	description: "Delete EuroMilhões entries",
	permission: "`SEND_MESSAGES`",
	usage: "`/euromilhoes-limpar`",
	subcommand: false,
	type: "Utility ⚙️",
	data: new SlashCommandBuilder()
		.setName('euromilhoes-limpar')
		.setDescription('Delete EuroMilhões entries')
		.addStringOption(option =>
			option.setName('periodo')
				.setDescription('Period to delete')
				.setRequired(true)
				.addChoices(
					{ name: 'This Week', value: 'week' },
					{ name: 'Today', value: 'today' },
					{ name: 'All Time', value: 'all' }
				)
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator, PermissionFlagsBits.UseApplicationCommands, PermissionFlagsBits.SendMessages)
		.setContexts(0) // 0 for guild | 1 for botDM | 2 everywhere
		.setIntegrationTypes(0) // 0 for guild install | 1 for user install
		.setNSFW(false),

	async execute(interaction) {
		await interaction.deferReply();

		const periodo = interaction.options.getString('periodo');
		let startDate;

		try {
			const now = new Date();

			switch (periodo) {
				case 'week':
					const dayOfWeek = now.getDay();
					const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
					startDate = new Date(now);
					startDate.setDate(now.getDate() - daysToMonday);
					startDate.setHours(0, 0, 0, 0);
					break;

				case 'today':
					startDate = new Date(now);
					startDate.setHours(0, 0, 0, 0);
					break;

				case 'all':
					startDate = new Date(0); // Unix epoch
					break;
			}

			// Delete entries from main schema
			const result = await euroMilhoesModel.deleteMany({
				Guild: interaction.guild.id,
				createdAt: { $gte: startDate }
			});

			// Delete entries from stats schema
			const statsResult = await euroMilhoesStatsModel.deleteMany({
				GuildId: interaction.guild.id,
				LastUpdated: { $gte: startDate }
			});

			console.log(`Deleted ${result.deletedCount} entries and ${statsResult.deletedCount} stats (${periodo})`);

			const periodoText = {
				week: 'this week',
				today: 'today',
				all: 'all time'
			};

			await interaction.editReply({
				content: `✅ Successfully deleted **${result.deletedCount}** EuroMilhões entries and **${statsResult.deletedCount}** store stats from ${periodoText[periodo]}.`
			});

		} catch (error) {
			console.error('Error deleting entries:', error);
			await interaction.editReply({
				content: '❌ Error deleting entries. Please try again.',
				ephemeral: true
			});
		}
	}
};