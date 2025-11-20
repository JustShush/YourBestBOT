const { SlashCommandBuilder, PermissionFlagsBits, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

const allowedRoles = [
	"1440751100679422094", // TACOS
	"1440751133223161976", // Hogs
	"1440765613965316096", // Barrigas
	"1440765655199649984", // Chines
	"1440765796161687775", // Malibu
	"1440765899903860887", // Bahamas
	"1440765946158514377", // PDM
	"1440766258659459072", // Fiandeiro
	"1440830577052749908", // Bennys
	"1440830614973583382", // TuneTown
];

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

		// Check if user has any of the allowed roles
		const memberRoles = interaction.member.roles.cache || await interaction.member.roles.fetch();
		const hasPermission = memberRoles.some(role => allowedRoles.includes(role.id));

		if (!hasPermission) {
			return await interaction.reply({
				content: '❌ Nao tens permissao para usar este comando.',
				ephemeral: true
			});
		}

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