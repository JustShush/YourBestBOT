const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
	name: "commands",
	data: new SlashCommandBuilder()
		.setName("commands")
		.setDescription("Show all the commands available."),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction, client) {

		// random colors from one dark color palette
		const colors = ['#282C34', '#E06C75', '#98C379', '#E5C07b', '#61AFEF', '#C678DD', '#56B6C2', '#ABB2BF', '#6B859E', '#3890E9', '#A359ED', '#EC5252', '#C97016', '#5DA713', '#13AFAF'];
		const color = Math.floor(Math.random() * colors.length);
		const resColor = colors[color];
		// end of the color randomization

		const { member } = interaction

		const cmdEmbed = new EmbedBuilder()
			.setColor(member.displayHexColor)
			.setTitle('**Commands**')
			.setThumbnail(interaction.guild.iconURL())
			.addFields({
				name: '`⚙️`- Utilities',
				value: '</help:1052662424752377969>, </ping:1052662424790106149>, `userinfo`, `serverinfo`, </bot:1052662424790106148>, </bin:1052662424790106147>, `invites`, </uptime:1052662424790106151>',
				inline: false
			}, {
				name: 'Check your ping',
				value: '</ping:1052662424790106149>',
				inline: false
			}, {
				name: '`🎉`- Fun',
				value: '</dadjokes:1052662424718815290>, </rickroll:1052662424718815291>, `whoisbestgirl`, </songs:1052662424752377966>, </welcome:1052662424752377967>, </yomama:1052662424752377968>',
				inline: false
			}, {
				name: '\u200B',
				value: '\u200B',
				inline: false
			}, {
				name: '`💸`- Economy',
				value: '</daily:1052662424718815287>, </beg:1052662424718815286>, </search:1052662424718815289>, </leaderboard:1052662424718815288>, </balance:1052662424718815285>, </dice:1075840700807123105>',
				inline: false
			}, {
				name: '`🔨`- Setup',
				value: '</setup-welcome:1052662424790106146>, </setup-goodbye:1052662424790106144>, </setup-logs:1052662424790106145>',
				inline: false
			}, {
				name: '`🛠️`- Staff',
				value: '`hmod`, </kick:1052662424752377972>, </ban:1052662424752377970>, </timeout:1052662424790106142>, </clear:1052662424752377971>, </slowmode:1052662424752377975>, `on`, `announce`, `dm`, </setnick:1052662424752377974>, </modnick:1052662424752377973>',
				inline: false
			})
			.setFooter({
				text: `Requested by ${interaction.user.username}`,
				iconURL: member.user.displayAvatarURL()
			})
			.setTimestamp()

		interaction.reply({ embeds: [cmdEmbed] });
	}
}
