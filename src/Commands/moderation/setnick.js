const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const logdb = require("../../schemas/log");

module.exports = {
	name: "setnick",
	data: new SlashCommandBuilder()
		.setName("setnick")
		.setDescription("Change the nickname of a member.")
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
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

		const { options, guild, member } = interaction

		const User = options.getUser("member").id;
		const user = guild.members.cache.get(User);
		const newnick = options.getString("name");

		const errorsArray = [];
		const errorsEmbed = new EmbedBuilder()
			.setAuthor({ name: "Could not timeout member due to:" })
			.setColor("Red")

		if (!user.manageable || !user.moderatable)
			errorsArray.push("Selected target is not moderatable by the bot.")

		if (member.roles.highest.position < user.roles.highest.position)
			errorsArray.push("Selected member has a higher role position than you.");

		if (errorsArray.length) return interaction.reply({
			embeds: [errorsEmbed.setDescription(errorsArray.join("\n"))],
			ephemeral: true
		})

		user.setNickname(newnick);

		const logchannel = await logdb.findOne({ Guild: guild.id })
		if (logchannel) {
			const check = client.channels.cache.get(logchannel.Channel);
			//console.log("SIUUU");
			if (check) {
				const logEmbed = new EmbedBuilder()
					.setTitle(`SetNickName`)
					.setDescription(`${user}'s nickname has been set to: \`${newnick}\`\nBy: ${interaction.member}`)
					.setTimestamp()

				//console.log("test");
				check.send({
					content: `${user}`,
					embeds: [logEmbed]
				})
			}
		}

		interaction.reply({ content: `NickName of ${user.user.tag} has been changed to: ${newnick}`, ephemeral: true });
	}
}
