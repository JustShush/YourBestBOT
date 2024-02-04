const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { User42 } = require("../../functions/42User");

module.exports = {
	name: "42",
	description: "Search for a 42 student.",
	permission: "`SEND_MESSAGES`",
	usage: "`/status`",
	type: "Misc",
	data: new SlashCommandBuilder()
		.setName("42")
		.setDescription("Search for a 42 student.")
		.addStringOption((option) => option
			.setName("student")
			.setDescription("The Student you want to search.")
			.setRequired(true)
		)
		.setDMPermission(true)
		.setNSFW(false),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction, client) {

		const { options } = interaction;

		const User = options.getString("student");

		await interaction.deferReply({ ephemeral: true });
		await interaction.editReply({ content: `Fetching user data...`, ephemeral: true });

		const user = await User42(User); // ifreire-

		if (!user) return interaction.editReply({ content: `There was a problem trying to fetch the user data.`, ephemeral: true });

		const embed = new EmbedBuilder()
			.setColor("Green")

		if (user.name)
			embed.setTitle(user.name + "'s intra Profile.")
		if (user.image)
			embed.setThumbnail(user.image)
		if (user.campus && user.cursus && user.grade && user.kind)
			embed.setDescription(`Campus: ${user.campus}\nCursus: ${user.cursus}\nGrade: ${user.kind}/${user.grade}.`)
		user.projects.forEach(ele => {
			embed.addFields({ name: ele.name, value: `${ele.description}\n**KeyWords:** ${ele.keywords.join(", ")}\n**Group:** ${user.group ? "Yes" : "No"} | Bonus: ${user.bonus ? "Yes" : "No"}`, inline: true })
		});

		const row = new ActionRowBuilder().setComponents(
			new ButtonBuilder()
				.setLabel("Public Profile")
				.setEmoji("🔗")
				.setURL(`https://profile.intra.42.fr/users/${user.login}`)
				.setStyle(ButtonStyle.Link),
			new ButtonBuilder()
				.setLabel("School Website")
				.setEmoji("<:discord:1201226391987957901>")
				.setURL(`${user.website}`)
				.setStyle(ButtonStyle.Link),
			new ButtonBuilder()
				.setLabel("42 School Maps")
				.setEmoji("🌐")
				.setURL(`${user.loc}`)
				.setStyle(ButtonStyle.Link))

		interaction.editReply({ embeds: [embed], components: [row], ephemeral: true })
	}
}

//* get link to the public user intra profile
// get the link for google maps for depending on the shool the user is in