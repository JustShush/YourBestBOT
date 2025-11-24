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

			// Define prize tiers
			const prizeTiers = {
				'1st': { name: '🥇 1º Lugar - 4 Números + 1 Estrela', numeros: 4, estrelas: 1, winners: [] },
				'2nd': { name: '🥈 2º Lugar - 4 Números', numeros: 4, estrelas: 0, winners: [] },
				'3rd': { name: '🥉 3º Lugar - 3 Números + 1 Estrela', numeros: 3, estrelas: 1, winners: [] }
			};

			// Find winners for each ticket
			for (const ticket of allTickets) {
				// Count matching numbers
				const matchingNumeros = ticket.Numeros.filter(num =>
					winningNumeros.includes(num)
				).length;

				// Count matching stars
				const matchingEstrelas = ticket.Estrelas.filter(star =>
					winningEstrelas.includes(star)
				).length;

				// Normalize phone number
				const phoneNumber = Array.isArray(ticket.phoneNumber)
					? ticket.phoneNumber.join('')
					: ticket.phoneNumber.toString();

				const winnerData = {
					ticket,
					matchingNumeros,
					matchingEstrelas,
					phoneNumber
				};

				// Check which tier this ticket wins
				if (matchingNumeros === 4 && matchingEstrelas === 1) {
					prizeTiers['1st'].winners.push(winnerData);
				} else if (matchingNumeros === 4 && matchingEstrelas === 0) {
					prizeTiers['2nd'].winners.push(winnerData);
				} else if (matchingNumeros === 3 && matchingEstrelas === 1) {
					prizeTiers['3rd'].winners.push(winnerData);
				}
			}

			// Remove duplicate winners (same phone number) - keep first occurrence
			for (const tier of Object.values(prizeTiers)) {
				const uniquePhones = new Set();
				tier.winners = tier.winners.filter(w => {
					if (uniquePhones.has(w.phoneNumber)) {
						return false;
					}
					uniquePhones.add(w.phoneNumber);
					return true;
				});
			}

			// Count total unique winners
			const totalWinners = Object.values(prizeTiers).reduce((sum, tier) => sum + tier.winners.length, 0);

			console.log(`1st Place: ${prizeTiers['1st'].winners.length}, 2nd Place: ${prizeTiers['2nd'].winners.length}, 3rd Place: ${prizeTiers['3rd'].winners.length}`);

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
					value: `Total de apostas: ${allTickets.length}\nVencedores únicos: ${totalWinners}`,
					inline: false
				})
				.setTimestamp();

			// Add winners for each tier
			let hasWinners = false;

			for (const [tierKey, tier] of Object.entries(prizeTiers)) {
				if (tier.winners.length > 0) {
					hasWinners = true;
					const winnersList = tier.winners
						.slice(0, 10) // Limit to 10 per tier
						.map(w => {
							const user = `<@${w.ticket.UserId}>`;
							const numbers = w.ticket.Numeros.join('-');
							const stars = w.ticket.Estrelas.join('-');
							return `${user} | 📞 ${w.phoneNumber} | 🎱 ${numbers} ⭐ ${stars} | 🏪 ${w.ticket.Estabelecimento}`;
						})
						.join('\n');

					embed.addFields({
						name: `${tier.name} (${tier.winners.length} vencedor${tier.winners.length > 1 ? 'es' : ''})`,
						value: winnersList,
						inline: false
					});

					// Show count if more than 10 winners in this tier
					if (tier.winners.length > 10) {
						embed.addFields({
							name: '\u200b',
							value: `_... e mais ${tier.winners.length - 10} vencedor${tier.winners.length - 10 > 1 ? 'es' : ''}_`,
							inline: false
						});
					}
				}
			}

			if (!hasWinners) {
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