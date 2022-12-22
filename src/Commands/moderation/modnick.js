const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const logdb = require("../../schemas/log");

module.exports = {
	name: "modnick",
	data: new SlashCommandBuilder()
		.setName("modnick")
		.setDescription("Moderate a user\'s name")
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames, PermissionFlagsBits.ChangeNickname)
		.addUserOption((option) => option
			.setName("target")
			.setDescription("The member to change the nickname.")
			.setRequired(true)
		)
		.addStringOption((option) => option
			.setName("reason")
			.setDescription("The reason for changing the nickname of the user.")
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

		const User = options.getUser("target").id;
		const user = guild.members.cache.get(User);
		let reason = options.getString("reason");

		if (!reason) reason = "No reason given.";

		// the function that generates the numbers
		const randomID = length => Math.floor(Math.random() * Math.pow(10, length));
		// replace 3 with how many characters you want
		randomID(3) // return example: 581
		const newnick = randomID(5)

		const embed = new EmbedBuilder()
			.setColor(resColor)
			.setTitle(`Your nickname on \`${interaction.guild.name}\`has been changed!`)
			.setDescription(`It has been change to: \`Moderated Nickname ${newnick}\`.\nBy: ${interaction.member}\nReason: \`\`\`${reason}\`\`\``)
			.setTimestamp()

		const errorsArray = [];
		const errorsEmbed = new EmbedBuilder()
			.setAuthor({ name: "Could not modnick due to:" })
			.setColor("Red")

		if (!user.manageable || !user.moderatable)
			errorsArray.push("Selected target is not moderatable by the bot.")

		if (member.roles.highest.position < user.roles.highest.position)
			errorsArray.push("Selected member has a higher role position than you.");

		user.setNickname("Moderated Nickname " + newnick).catch(err => {
			errorsArray.push(`Couldn't change the ${user}\'s nickname.`);
			console.log(err);
		});

		user.send({
			content: `${user}`,
			embeds: [embed]
		}).catch(err => {
			errorsArray.push(`Cannot send messages to this user.`);
			console.log(err);
		}) // its not working as i imagined sadge

		if (errorsArray.length) {

			console.log(errorsArray);

			return interaction.reply({
				embeds: [errorsEmbed.setDescription(errorsArray.join("\n"))],
				ephemeral: true
			})
		}

		const logchannel = await logdb.findOne({ Guild: guild.id })
		if (logchannel) {
			const check = client.channels.cache.get(logchannel.Channel);
			if (check) {
				const logEmbed = new EmbedBuilder()
					.setTitle(`ModNickname`)
					.setDescription(`${user}'s Nickname has been moderated to: \`${newnick}\`\nBy: ${member}\nReason: \`\`\`${reason}\`\`\``)
					.setTimestamp()

				//console.log("test");
				check.send({
					content: `${user}`,
					embeds: [logEmbed]
				})
			}
		}

		interaction.reply({ content: `NickName of ${user.user.tag} has been changed to: \`Moderated Nickname ${newnick}\`\nReason: \`\`\`${reason}\`\`\``, ephemeral: true });
	}
}
