const {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	PermissionFlagsBits
} = require("discord.js");

module.exports = {
	name: "say",
	developer: true,
	type: "Admin",
	data: new SlashCommandBuilder()
		.setName("say")
		.setDescription("Make YourBestBot say something.")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addStringOption(option =>
			option
				.setName("channel")
				.setDescription("The channel id")
				.setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName("msg")
				.setDescription("The msg you want to say.")
				.setRequired(true)
		)
		.setDMPermission(false)
		.setNSFW(false),

	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction, client) {
		const { options, guild, user } = interaction;

		const channelId = options.getString("channel");
		let msg = options
			.getString("msg")
			.replace(/\\n/g, "\n")
			.replace(/\\t/g, "\t")
			.replace(/\\r/g, "");

		const channel = guild.channels.cache.get(channelId);
		if (!channel) {
			return interaction.reply({
				content: "I wasn't able to send a message to that channel.",
				ephemeral: true
			});
		}

		const MAX_LENGTH = 1900;

		// --- Markdown-safe splitting (by lines) ---
		const lines = msg.split("\n");
		const chunks = [];
		let currentChunk = "";

		for (const line of lines) {
			// +1 for newline
			if ((currentChunk + line + "\n").length > MAX_LENGTH) {
				chunks.push(currentChunk);
				currentChunk = "";
			}
			currentChunk += line + "\n";
		}

		if (currentChunk.trim().length > 0) {
			chunks.push(currentChunk);
		}

		// Send chunks in order
		for (const chunk of chunks) {
			await channel.send({ content: chunk });
		}

		await interaction.reply({
			content: "Message sent successfully.",
			ephemeral: true
		});

		console.log(
			`${user.id} ${user.tag} has sent a message to ${channel.name}.`.green
		);
	}
};
