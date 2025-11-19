const { SlashCommandBuilder, PermissionFlagsBits, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
	name: "euromilhoes",
	description: "Create a new EuroMilhoes ticket",
	permission: "`SEND_MESSAGES`",
	usage: "`/euromilhoes`",
	subcommand: false,
	type: "Utility ⚙️",
	data: new SlashCommandBuilder()
		.setName('euromilhoes')
		.setDescription('Get a larger version of a custom emoji')
		.setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands, PermissionFlagsBits.SendMessages)
		.setContexts(0) // 0 for guild | 1 for botDM | 2 everywhere
		.setIntegrationTypes(0) // 0 for guild install | 1 for user install
		.setNSFW(false),
	async execute(interaction) {
		// Create modal
		const modal = new ModalBuilder()
			.setCustomId('ticketModal')
			.setTitle('Create Ticket');

		// Phone number input
		const phoneInput = new TextInputBuilder()
			.setCustomId('phoneNumber')
			.setLabel('Numero Telemovel')
			.setStyle(TextInputStyle.Short)
			.setPlaceholder('123456789')
			.setMinLength(9)
			.setMaxLength(9)
			.setRequired(true);

		// Number 1 input
		const number1Input = new TextInputBuilder()
			.setCustomId('number1')
			.setLabel('Os numeros')
			.setStyle(TextInputStyle.Short)
			.setPlaceholder('Os numeros 4/10')
			.setMinLength(4)
			.setMaxLength(10)
			.setRequired(true);

		// Number 2 input
		const number2Input = new TextInputBuilder()
			.setCustomId('number2')
			.setLabel('As estrelas')
			.setStyle(TextInputStyle.Short)
			.setPlaceholder('As estrelas 1/5')
			.setMinLength(1)
			.setMaxLength(5)
			.setRequired(true);

		// Add inputs to action rows
		const firstRow = new ActionRowBuilder().addComponents(phoneInput);
		const secondRow = new ActionRowBuilder().addComponents(number1Input);
		const thirdRow = new ActionRowBuilder().addComponents(number2Input);

		modal.addComponents(firstRow, secondRow, thirdRow);
		await interaction.showModal(modal);
	}
};
