const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { embedColor } = require('../../functions/utils.js');
const UserStatsSchema = require('../../schemas/userStats.js');
const { listenerCount } = require("../../schemas/economy_checker");

module.exports = {
	name: "vote",
	description: "Vote for YourBestBot <3",
	permission: "`SEND_MESSAGES`",
	usage: "`/vote`",
	type: "Utility ⚙️",
	data: new SlashCommandBuilder()
		.setName("vote")
		.setDescription("Vote for YourBestBot <3")
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
		.setContexts(0, 1) // 0 for guild | 1 for botDM | 2 everywhere
		.setIntegrationTypes(0, 1) // 0 for guild install | 1 for user install
		.setNSFW(false),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction) {

		let baseMsg = `<:dot:1289304871467483216> Lend your support to YourBestBOT with a [free vote on top.gg](https://yourbestbot.pt/vote) it allows people to find YourBestBot more easily, thanks for your support! <3\n<:dot:1289304871467483216> **Voting for me will get give you some perks in some places and a [unique role in our community server](https://yourbestbot.pt/support) for the next 12 hours!**`;

		const newEmbed = new EmbedBuilder()
			.setTitle('<3 Support me by voting! <3')
			.setColor(embedColor())

		const userData = await UserStatsSchema.findOne({ UserId: interaction.user.id });
		if (!userData) return console.log('ERROR -> getting user stats');
		if (userData.isVoter) baseMsg = baseMsg + `\n\nyou have already voted today, come back <t:${Math.floor((userData.Votes.last / 1000) + 43200)}:R> to vote again!`

		newEmbed.setDescription(baseMsg);

		const row = new ActionRowBuilder()
		.addComponents(
			new ButtonBuilder()
				.setLabel("Vote for YourBestBOT")
				.setEmoji('❤️')
				.setURL(`https://yourbestbot.pt/vote`)
				.setStyle(ButtonStyle.Link),
				new ButtonBuilder()
				.setLabel(`Add YourBestBOT`)
				.setEmoji("🔗")
				.setURL('https://yourbestbot.pt/invite')
				.setStyle(ButtonStyle.Link),
		);

		interaction.reply({ embeds: [newEmbed], components: [row] });
	}
}
