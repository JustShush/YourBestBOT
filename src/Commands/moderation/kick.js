const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
	name: "kick",
	permissions: ["KICK_MEMBERS"],
	data: new SlashCommandBuilder()
		.setName("kick")
		.setDescription("Kicks the member given.")
		.addUserOption((option) => option
			.setName("target")
			.setDescription(`The member you'd like to kick`)
			.setRequired(true))
		.addStringOption((option) => option
			.setName("reason")
			.setDescription("The reason for kicking the member provided.")),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction, client) {

		// random colors from one dark color palette 
		const colors = ['#282C34', '#E06C75', '#98C379', '#E5C07b', '#61AFEF', '#C678DD', '#56B6C2', '#ABB2BF', '#6B859E', '#3890E9', '#A359ED', '#EC5252', '#C97016', '#5DA713', '#13AFAF'];
		const color = Math.floor(Math.random() * colors.length);
		const resColor = colors[color];
		// end of the color randomization 

		const { options } = interaction;

		const user = options.getUser("target");
		const member = await interaction.guild.members.fetch(user.id).catch(console.error);
		let reason = options.getString("reason");

		if (!reason) reason = "No reason given.";

		const kickEmbed = new EmbedBuilder()
			.setColor(resColor)
			.setTitle(`You have been kick from: \`${interaction.guild.name}\``)
			.setTimestamp()

		await user.send({
			content: `${user}`,
			embeds: [kickEmbed.setDescription(`By: ${interaction.member}\nReason: \`\`\`${reason}\`\`\``)]
		}).catch();

		await member.kick(reason).catch(console.error);

		interaction.reply({ embeds: [kickEmbed.setDescription(`${user} as been kicked from the server successfully ✅`)], ephemeral: true });
	}
}
