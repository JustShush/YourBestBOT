const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const storeSalesModel = require('../../schemas/euroMilhoesStats');

module.exports = {
	name: "euromilhoes-stats",
	description: "Create a new EuroMilhoes ticket",
	permission: "`SEND_MESSAGES`",
	usage: "`/euromilhoes-stats`",
	subcommand: false,
	type: "Utility ⚙️",
	data: new SlashCommandBuilder()
		.setName('euromilhoes-stats')
		.setDescription('View store sales statistics')
		.addStringOption(option =>
			option.setName('store')
				.setDescription('Filter by specific store (optional)')
				.setRequired(false)
				.addChoices(
					{ name: 'TACOS', value: 'TACOS' },
					{ name: 'Hogs', value: 'Hogs' },
					{ name: 'Barrigas', value: 'Barrigas' },
					{ name: 'Chines', value: 'Chines' },
					{ name: 'Malibu', value: 'Malibu' },
					{ name: 'Bahamas', value: 'Bahamas' },
					{ name: 'PDM', value: 'PDM' },
					{ name: 'Fiandeiro', value: 'Fiandeiro' },
					{ name: 'Bennys', value: 'Bennys' },
					{ name: 'TuneTown', value: 'TuneTown' }
				)
		),

	async execute(interaction) {
		await interaction.deferReply();

		try {
			const storeName = interaction.options.getString('store');
			const query = { GuildId: interaction.guild.id };

			if (storeName) {
				query.StoreName = storeName;
			}

			const sales = await storeSalesModel.find(query).sort({ TotalRevenue: -1 });

			if (sales.length === 0) {
				return await interaction.editReply({
					content: '❌ No sales data found.',
					ephemeral: true
				});
			}

			// Calculate totals
			const totalTickets = sales.reduce((sum, store) => sum + store.TotalTickets, 0);
			const totalRevenue = sales.reduce((sum, store) => sum + store.TotalRevenue, 0);

			// Create embed
			const embed = new EmbedBuilder()
				.setTitle('📊 Store Sales Statistics')
				.setColor('#5865F2')
				.setTimestamp();

			if (storeName) {
				// Single store view
				const store = sales[0];
				embed.setDescription(`**${store.StoreName}** Performance`)
					.addFields(
						{ name: '🎫 Total Tickets', value: store.TotalTickets.toString(), inline: true },
						{ name: '💰 Total Revenue', value: `€${store.TotalRevenue.toFixed(2)}`, inline: true },
						{ name: '📅 Last Updated', value: `<t:${Math.floor(store.LastUpdated.getTime() / 1000)}:R>`, inline: false }
					);
			} else {
				// All stores view
				embed.setDescription(`Performance overview for all stores`)
					.addFields(
						{ name: '🎫 Total Tickets', value: totalTickets.toString(), inline: true },
						{ name: '💰 Total Revenue', value: `€${totalRevenue.toFixed(2)}`, inline: true },
						{ name: '\u200B', value: '\u200B', inline: false }
					);

				// Add top 10 stores
				const topStores = sales.slice(0, 10);
				topStores.forEach((store, index) => {
					const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
					embed.addFields({
						name: `${medal} ${store.StoreName}`,
						value: `🎫 ${store.TotalTickets} tickets | 💰 €${store.TotalRevenue.toFixed(2)}`,
						inline: false
					});
				});
			}

			await interaction.editReply({ embeds: [embed] });

		} catch (error) {
			console.error('Error fetching sales data:', error);
			await interaction.editReply({
				content: '❌ Error retrieving sales data. Please try again.',
				ephemeral: true
			});
		}
	}
};