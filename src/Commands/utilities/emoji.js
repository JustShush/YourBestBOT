const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
	name: "emoji",
	description: "Get a larger version of a user\'s avatar",
	permission: "`SEND_MESSAGES`",
	usage: "`/emoji <customEmoji>`",
	subcommand: true,
	type: "Utility ⚙️",
	data: new SlashCommandBuilder()
		.setName('emoji')
		.setDescription('Get a larger version of a custom emoji')
		.addSubcommand(sub => sub
			.setName('enlarge')
			.setDescription('Get a larger version of a user\'s avatar')
			.addStringOption(o => o
					.setName('emoji')
					.setDescription('The custom emoji to enlarge')
					.setRequired(true)
			)
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands, PermissionFlagsBits.SendMessages),
	async execute(interaction) {
		const emojiInput = interaction.options.getString('emoji');

		// Extract the emoji ID from the provided input
		const emojiMatch = emojiInput.match(/<a?:\w+:(\d+)>/);
		if (!emojiMatch) return await interaction.reply({ content: `You can\'t enlarge default emojis!`, ephemeral: true });

		const emojiId = emojiMatch[1];
		const isAnimated = emojiInput.startsWith('<a:'); // check if it's an animated emoji
		const emojiUrl = `https://cdn.discordapp.com/emojis/${emojiId}.${isAnimated ? 'gif' : 'png'}?size=1024`;

		const newEmbed = new EmbedBuilder()
			.setTitle('Your emoji has been enlarged!')
			.setColor("#2B2D31")
			.setImage(`${emojiUrl}`)

		await interaction.reply({ embeds: [newEmbed] });
	}
};
