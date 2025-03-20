const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	name: "avatar",
	description: "Get a larger version of a user\'s avatar",
	permission: "`SEND_MESSAGES`",
	usage: "`/avatar`, `/avatar <Member>`",
	type: "Utility ⚙️",
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Get a larger version of a user\'s avatar')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('The user to get the avatar from')
				.setRequired(false)
		)
		.setContexts(0, 1, 2) // 0 for guild | 1 for botDM | 2 everywhere
		.setIntegrationTypes(0, 1) // 0 for guild install | 1 for user install
		.setNSFW(false),
	async execute(interaction) {
		const user = interaction.options.getUser('user') || interaction.user;
		const avatarUrl = user.displayAvatarURL({ dynamic: true, size: 1024 });

		const newEmbed = new EmbedBuilder()
			.setTitle(`${user.globalName || user.username}\'s Profile Picture`)
			.setColor("#2B2D31")
			.setImage(`${avatarUrl}`)
			.setTimestamp()

		await interaction.reply({ embeds: [newEmbed] });
	}
};
