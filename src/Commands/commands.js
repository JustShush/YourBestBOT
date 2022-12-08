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
				value: '</help:1048732631140937808>, </ping:1046865666134786169>, `userinfo`, `serverinfo`, </bot:1048732631140937809>, </bin:1047683862999859302>, `invites`, </uptime:1047174162990518383>',
				inline: false
			}, {
				name: 'Check your ping',
				value: '</ping:1046865666134786169>',
				inline: false
			}, {
				name: '`🎉`- Fun',
				value: '</dadjokes:1046942864673878106>, </rickroll:1046962540426571856>, `whoisbestgirl`, </songs:1046960024506867763>, </welcome:1049796256198819893>, </yomama:1046961231099068466>',
				inline: false
			}, {
				name: '\u200B',
				value: '\u200B',
				inline: false
			}, {
				name: '`🔨`- Setup',
				value: '</setup-welcome:1049788395733401622>, </setup-goodbye:1049788395733401620>, </setup-logs:1049788395733401621>',
				inline: false
			}, {
				name: '`🛠️`- Staff',
				value: '`hmod`, </kick:1047656524597690480>, </ban:1047665323307962368>, </timeout:1047642895739531385>, </clear:1049075429585211483>, </slowmode:1048822606876397618>, `on`, `announce`, `dm`, </setnick:1049064624735129670>, </modnick:1049060130043461712>',
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
