const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Ticket = require("../../schemas/euroMilhoes");

module.exports = {
	name: "euromilhoes-find",
	type: "Utility ⚙️",
	developer: true,
	data: new SlashCommandBuilder()
		.setName('euromilhoes-find')
		.setDescription('Find a combination that has not been used yet')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	async execute(interaction) {
		await interaction.deferReply();

		// Fetch all tickets for this guild
		const tickets = await Ticket.find({ Guild: interaction.guild.id });

		// Build a Set of existing combinations for fast lookup
		const existingCombinations = new Set(
			tickets.map(t => `${t.Numeros.join(',')}:${t.Estrelas.join(',')}`)
		);

		// Helper to generate all 4-number combinations (1-9) without duplicates
		function* generateNumberCombinations() {
			for (let a = 1; a <= 9; a++)
				for (let b = 1; b <= 9; b++)
					for (let c = 1; c <= 9; c++)
						for (let d = 1; d <= 9; d++) {
							const nums = [a, b, c, d];
							const set = new Set(nums);
							if (set.size === 4) { // ensure no duplicates
								yield nums.sort((x, y) => x - y);
							}
						}
		}

		// Helper to generate all 1-star combinations (1-2)
		function* generateStarCombinations() {
			for (let s = 1; s <= 2; s++) {
				yield [s];
			}
		}

		// Search for first unused combination
		for (const numeros of generateNumberCombinations()) {
			for (const estrelas of generateStarCombinations()) {
				const key = `${numeros.join(',')}:${estrelas.join(',')}`;
				if (!existingCombinations.has(key)) {
					return interaction.editReply(
						`✅ Unused combination found:\nNumbers: ${numeros.join(' ')}\nStar: ${estrelas[0]}`
					);
				}
			}
		}

		return interaction.editReply('❌ All possible combinations have been used.');
	}
};
