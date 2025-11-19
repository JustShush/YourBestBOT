const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const euroMilhoesModel = require('../../schemas/euroMilhoes');

module.exports = {
	name: "euromilhoes-sorteio",
	description: "Draw EuroMilhões winning numbers and show winners",
	permission: "`SEND_MESSAGES`",
	usage: "`/euromilhoes-sorteio`",
	subcommand: false,
	type: "Utility ⚙️",
	data: new SlashCommandBuilder()
		.setName('euromilhoes-sorteio')
		.setDescription('Draw EuroMilhões winning numbers and show winners')
		.addStringOption(o => o
			.setName('numeros')
			.setDescription("Winning numbers (e.g., 1 2 3 4)")
			.setMinLength(4)
			.setMaxLength(7)
			.setRequired(true)
		)
		.addStringOption(o => o
			.setName('estrelas')
			.setDescription("Winning stars (e.g., 5)")
			.setMinLength(1)
			.setMaxLength(1)
			.setRequired(true)
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator, PermissionFlagsBits.UseApplicationCommands, PermissionFlagsBits.SendMessages)
		.setContexts(0) // 0 for guild | 1 for botDM | 2 everywhere
		.setIntegrationTypes(0) // 0 for guild install | 1 for user install
		.setNSFW(false),

	async execute(interaction) {
		await interaction.deferReply();

		// Parse winning numbers
		const parseNumbers = (input) => {
			return input.split(/[\s,]+/).map(n => parseInt(n.trim())).filter(n => !isNaN(n));
		};

		const winningNumeros = parseNumbers(interaction.options.getString('numeros'));
		const winningEstrelas = parseNumbers(interaction.options.getString('estrelas'));

		// Validate input
		if (winningNumeros.length !== 4) {
			return await interaction.editReply('❌ You must provide exactly 4 winning numbers!');
		}

		if (winningEstrelas.length !== 1) {
			return await interaction.editReply('❌ You must provide exactly 1 winning star!');
		}

		try {
			// Get all tickets from database
			const allTickets = await euroMilhoesModel.find({
				Guild: interaction.guild.id
			});

			console.log(`Checking ${allTickets.length} tickets for winners`);

			// Find all winning tickets with their scores
			const allWinningTickets = [];

			for (const ticket of allTickets) {
				// Count matching numbers
				const matchingNumeros = ticket.Numeros.filter(num =>
					winningNumeros.includes(num)
				).length;

				// Count matching stars
				const matchingEstrelas = ticket.Estrelas.filter(star =>
					winningEstrelas.includes(star)
				).length;

				// Check if it's a winner (you can adjust winning criteria)
				if (matchingNumeros >= 2 || (matchingNumeros >= 1 && matchingEstrelas >= 1)) {
					allWinningTickets.push({
						ticket,
						matchingNumeros,
						matchingEstrelas,
						score: matchingNumeros * 10 + matchingEstrelas // Weighted score (numbers worth more)
					});
				}
			}

			// Group by phone number and keep only best score per phone number
			const bestWinPerPhone = {};

			for (const winTicket of allWinningTickets) {
				// Normalize phone number (convert array to string if needed)
				const phoneNumber = Array.isArray(winTicket.ticket.phoneNumber)
					? winTicket.ticket.phoneNumber.join('')
					: winTicket.ticket.phoneNumber.toString();

				if (!bestWinPerPhone[phoneNumber] || winTicket.score > bestWinPerPhone[phoneNumber].score) {
					bestWinPerPhone[phoneNumber] = winTicket;
				}
			}

			// Convert back to array
			const winners = Object.values(bestWinPerPhone);

			// Sort winners by score (best matches first)
			winners.sort((a, b) => b.score - a.score);

			console.log(`Total winning tickets: ${allWinningTickets.length}, Unique winners (by phone): ${winners.length}`);

			// Create embed
			const embed = new EmbedBuilder()
				.setTitle('🎰 EuroMilhões - Resultados do Sorteio')
				.setColor('#FFD700')
				.addFields({
					name: '🎱 Números Sorteados',
					value: winningNumeros.join(' - '),
					inline: true
				})
				.addFields({
					name: '⭐ Estrela Sorteada',
					value: winningEstrelas.join(' - '),
					inline: true
				})
				.addFields({
					name: '📊 Estatísticas',
					value: `Total de apostas: ${allTickets.length}\nApostas vencedoras: ${allWinningTickets.length}\nVencedores únicos: ${winners.length}`,
					inline: false
				})
				.setTimestamp();

			// Add winners to embed
			if (winners.length > 0) {
				// Group winners by score
				const winnersByScore = {};
				winners.forEach(w => {
					const key = `${w.matchingNumeros}N + ${w.matchingEstrelas}E`;
					if (!winnersByScore[key]) winnersByScore[key] = [];
					winnersByScore[key].push(w);
				});

				// Add each group to embed
				for (const [scoreKey, scoreWinners] of Object.entries(winnersByScore)) {
					const winnersList = scoreWinners
						.slice(0, 10) // Limit to 10 per group
						.map(w => {
							const user = `<@${w.ticket.UserId}>`;
							const numbers = w.ticket.Numeros.join('-');
							const stars = w.ticket.Estrelas.join('-');
							const phone = Array.isArray(w.ticket.phoneNumber)
								? w.ticket.phoneNumber.join('')
								: w.ticket.phoneNumber;
							return `${user} | 📞 ${phone} | 🎱 ${numbers} ⭐ ${stars} | 🏪 ${w.ticket.Estabelecimento}`;
						})
						.join('\n');

					embed.addFields({
						name: `🏆 ${scoreKey} (${scoreWinners.length} vencedor${scoreWinners.length > 1 ? 'es' : ''})`,
						value: winnersList || 'Nenhum',
						inline: false
					});
				}

				// If too many winners, show count
				if (winners.length > 30) {
					embed.setFooter({ text: `Mostrando primeiros resultados. Total: ${winners.length} vencedores` });
				}
			} else {
				embed.addFields({
					name: '😢 Sem Vencedores',
					value: 'Nenhuma aposta vencedora neste sorteio.',
					inline: false
				});
			}

			await interaction.editReply({ embeds: [embed] });

		} catch (error) {
			console.error('Error finding winners:', error);
			await interaction.editReply({
				content: '❌ Erro ao buscar vencedores. Tente novamente.',
				ephemeral: true
			});
		}
	}
};