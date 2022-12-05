const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
	permissions: ["CHANGE_NICKNAME"],
	data: new SlashCommandBuilder()
		.setName("setnick")
		.setDescription("Change the nickname of a member.")
		.addUserOption((option) => option
			.setName("member")
			.setDescription("The member to change the nickname.")
			.setRequired(true)
	)
	.addStringOption((option) => option
			.setName("name")
			.setDescription("The new new nickname for the member.")
			.setRequired(true)
	),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction, client) {

		// random colors from one dark color palette
		const colors = ['#282C34', '#E06C75', '#98C379', '#E5C07b', '#61AFEF', '#C678DD', '#56B6C2', '#ABB2BF', '#6B859E', '#3890E9', '#A359ED', '#EC5252', '#C97016', '#5DA713', '#13AFAF'];
		const color = Math.floor(Math.random() * colors.length);
		const resColor = colors[color];
		// end of the color randomization

		const { options, guild } = interaction
		
		const User = options.getUser("member").id;
		const user = guild.members.cache.get(User);
		const newnick = options.getString("name");

		user.setNickname(newnick);

		interaction.reply({ content: `NickName of ${User.tag} has been changed to: ${newnick}`, ephemeral: true });
	}
}
