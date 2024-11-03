const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { parseDuration } = require('../../functions/utils.js');

module.exports = {
	name: "timestamp",
	description: "Generate a Discord timestamp from input time.",
	permission: "`SEND_MESSAGES`",
	usage: "`/timestamp`",
	type: "Misc",
	data: new SlashCommandBuilder()
		.setName("timestamp")
		.setDescription("Generate a Discord timestamp from input time.")
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
		.addIntegerOption(o => o
			.setName('seconds')
			.setDescription('Add seconds (optional)')
			.setRequired(false)
		)
		.addIntegerOption(o => o
			.setName('minutes')
			.setDescription('Add minutes (optional)')
			.setRequired(false)
		)
		.addIntegerOption(o => o
			.setName('hours')
			.setDescription('Add hours (optional)')
			.setRequired(false)
		)
		.addIntegerOption(o => o
			.setName('days')
			.setDescription('Add days (optional)')
			.setRequired(false)
		)
		.addIntegerOption(o => o
			.setName('months')
			.setDescription('Add months (optional)')
			.setRequired(false)
		)
		.addIntegerOption(o => o
			.setName('years')
			.setDescription('Add years (optional)')
			.setRequired(false)
		)
		.addStringOption(o => o
			.setName('date')
			.setDescription('Provide specific date in DD/MM/YYYY format (optional)')
			.setRequired(false)
		)
		.setContexts(0, 1, 2)
		.setIntegrationTypes(0, 1)
		.setDMPermission(true)
		.setNSFW(false),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	execute(interaction) {

		const seconds = interaction.options.getInteger('seconds') || 0;
		const minutes = interaction.options.getInteger('minutes') || 0;
		const hours = interaction.options.getInteger('hours') || 0;
		const days = interaction.options.getInteger('days') || 0;
		const months = interaction.options.getInteger('months') || 0;
		const years = interaction.options.getInteger('years') || 0;
		const dateStr = interaction.options.getString('date');

		let futureDate;
		if (dateStr) {
			const [day, month, year] = dateStr.split('/').map(Number);
			futureDate = new Date(year, month - 1, day);
		} else
			futureDate = new Date();

		futureDate.setSeconds(futureDate.getSeconds() + seconds);
		futureDate.setMinutes(futureDate.getMinutes() + minutes);
		futureDate.setHours(futureDate.getHours() + hours);
		futureDate.setDate(futureDate.getDate() + days);
		futureDate.setMonth(futureDate.getMonth() + months);
		futureDate.setFullYear(futureDate.getFullYear() + years);

		const timestamp = Math.floor(futureDate.getTime() / 1000);

		const newEmbed = new EmbedBuilder()
			.setTitle('Timestamp')
			.setColor('#0099ff')
			.setDescription(`\n-# Relative Time
				\`<t:${timestamp}:R>\` - <t:${timestamp}:R>\n-# Full Date and Time
				\`<t:${timestamp}:F>\` - <t:${timestamp}:F>\n-# Short Date
				\`<t:${timestamp}:D>\` - <t:${timestamp}:D>\n-# Long Time
				\`<t:${timestamp}:T>\` - <t:${timestamp}:T>\n-# Short Date & Time
				\`<t:${timestamp}:F>\` - <t:${timestamp}:F>\n-# Short Time
				\`<t:${timestamp}:t>\` - <t:${timestamp}:t>
				`)
			.setFooter({ text: 'YBB <3' })

		interaction.reply({ embeds: [newEmbed] });
	}
}

async function format(specificDate) {
	// Set your specific date in DD/MM/YYYY format
	//const specificDate = '29/10/2024';
	const [day, month, year] = specificDate.split('/');

	// Get the current time
	const now = new Date();

	// Update the year, month, and day to match the specific date, keeping the current hours, minutes, and seconds
	now.setFullYear(year);
	now.setMonth(month - 1); // Months are zero-based in JavaScript (0 = January)
	now.setDate(day);

	// Convert to Unix timestamp
	const unixTimestamp = Math.floor(now.getTime() / 1000);

	// Format the result for Discord
	const formattedTimestamp = `<t:${unixTimestamp}:R>`;
	console.log(formattedTimestamp);
	return formattedTimestamp;

}