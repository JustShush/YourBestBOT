const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js')
const { profileImage } = require('discord-arts');

module.exports = {
	name: "userinfo",
	description: "Get information about a user.",
	permission: "`SEND_MESSAGES`",
	usage: "`/userinfo`, `/userinfo <Member>`",
	type: "Utility ⚙️",
	data: new SlashCommandBuilder()
		.setName('userinfo')
		.setDescription('Get information about a user')
		.addUserOption(option => option
			.setName('target')
			.setDescription('Target to get info on this user')
			.setRequired(false)
		),
	async execute(interaction) {
		interaction.deferReply()

		let user = interaction.options.getUser('target')
		let member, profileBuffer
		if (!user) {
			member = await interaction.guild.members.fetch(interaction.user.id);
			user = interaction.user;
		}
		else
			member = await interaction.guild.members.fetch(user.id);
		profileBuffer = await profileImage(member.id);
		const username = user.username
		const avatar = user.displayAvatarURL()
		const joined = `<t:${parseInt(member.joinedAt / 1000)}:R>`
		const created = `<t:${parseInt(user.createdAt / 1000)}:R>`

		const roles = member.roles.cache.sort((a, b) => b.position - a.position);

		const Roles = roles
				.filter(role => role.name !== '@everyone') // Exclude @everyone role
				.map(r => r)
				.slice(0, 10) // Get only the first 10 roles
				.join(`, `) + (roles.size > 10 ? ` and ${roles.size - 10} more...` : '')
		/* const buffer = await profileImage(user.id, {
			presenceStatus: 'online',
			badgesFrame: true,
			moreBackgroundBlur: true,
			backgroundBrightness: 100,
		}); */
		const imageAttachment = new AttachmentBuilder(profileBuffer, { name: 'profile.png' });
		const embed = new EmbedBuilder()
			.addFields({ name: `Username:`, value: `${username}` })
			.addFields({ name: `🧾 • ${username} Created their account at:`, value: `${created}`, inline: true })
			.addFields({ name: `🧾 • ${username} joined this server at:`, value: `${joined}`, inline: true })
			.addFields({ name: `📚 • ${username}'s Roles`, value: Roles, inline: false })
			.setAuthor({ iconURL: avatar, name: `User ID: ${user.id}` })
			.setTimestamp()
			.setColor('Red')
			.setImage("attachment://profile.png")
		await interaction.editReply({ embeds: [embed], files: [imageAttachment] })

	}
}
