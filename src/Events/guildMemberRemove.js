const { EmbedBuilder, GuildMember } = require("discord.js");
const Schema = require("../schemas/goodbye");

module.exports = {
	name: "guildMemberRemove",
	/**
	 * @param {GuildMember} member
	 */
	async execute(member) {

		// random colors from one dark color palette 
		const colors = ['#282C34', '#E06C75', '#98C379', '#E5C07b', '#61AFEF', '#C678DD', '#56B6C2', '#ABB2BF', '#6B859E', '#3890E9', '#A359ED', '#EC5252', '#C97016', '#5DA713', '#13AFAF'];
		const color = Math.floor(Math.random() * colors.length);
		const resColor = colors[color];
		// end of the color randomization

		const { user, guild } = member;

		let data = await Schema.findOne({
			Guild: guild.id,
		});

		if (!data) return console.log(`\nThis server hasn\'t setup the goodbye command.\nServer: ${guild.name}. Member: ${user.tag}\nin file: \"guildMemberRemove.js\"`); // this server hasnt setup the welcome command
		let Channel = guild.channels.cache.get(data.Channel);
		let preMSG = data.MSG || "Bye... \:( hope he enjoyed his stay here.";
		if (!Channel) return;

		const MSG = preMSG.replaceAll('{member-count}', member.guild.memberCount)
			.replaceAll('{user-mention}', member)
			.replaceAll('{server-name}', member.guild.name)
			.replaceAll('{rules}', member.guild.rulesChannel)

		let byeEmbed = new EmbedBuilder()
			.setTitle(`${user.tag} left.`)
			.setColor(resColor)
			.setDescription(MSG)
			.setThumbnail(user.displayAvatarURL({
				dynamic: true
			}))
			.setFooter({ text: `We are now a server with ${guild.memberCount} members \<3` })

		try {
			Channel.send({ content: `<@${member.id}>`, embeds: [byeEmbed], ephemeral: true });
		} catch (err) {
			console.log(err)
			console.log("error on file guildMemberRemove. They prob removed the channel! " + guild.id + " | " + guild.name);
		}
	}
}
