const color = require("colors");
const { EmbedBuilder, GuildMember, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const Schema = require("../schemas/welcome");
const db = require("../schemas/nickSys");

module.exports = {
	name: "guildMemberAdd",
	/**
	 * @param {GuildMember} member
	 */
	async execute(member) {
		// random colors from one dark color palette
		const colors = ["#282C34", "#E06C75", "#98C379", "#E5C07b", "#61AFEF", "#C678DD", "#56B6C2", "#ABB2BF", "#6B859E", "#3890E9", "#A359ED", "#EC5252", "#C97016", "#5DA713", "#13AFAF",];
		const color = Math.floor(Math.random() * colors.length);
		const resColor = colors[color];
		// end of the color randomization

		const { user, guild } = member;

		let data = await Schema.findOne({
			Guild: guild.id,
		});

		if (!data) return console.log(`\n${user.tag} joined in ${guild.name}\nerror in file: \"guildMemberAdd.js\"`); // this server hasnt setup the welcome command
		let Channel = guild.channels.cache.get(data.Channel);
		let preMSG = data.MSG || "Welcome to the server.";
		let Role = data.Role;

		const MSG = preMSG.replaceAll('{member-count}', member.guild.memberCount)
			.replaceAll('{user-mention}', member)
			.replaceAll('{server-name}', member.guild.name)
			.replaceAll('{rules}', member.guild.rulesChannel)

		if (Role)
			await member.roles.add(Role).catch(err => console.log(err));

		let welEmbed = new EmbedBuilder()
			.setTitle(`${user.tag} joined.`)
			.setColor(resColor)
			.setDescription(MSG)
			.setThumbnail(
				user.displayAvatarURL({
					dynamic: true,
				})
			)
			.setFooter({ text: `We are now a server with ${guild.memberCount} members \<3` });

			console.log(`${user.tag} has joined ${member.guild.name} | ${member.guild.id}`.brightCyan);

		try {
			if (member.guild.id == "702545447750860931") {
				const row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setLabel("Rules")
						.setEmoji("🔗")
						.setURL(`https://discord.com/channels/${member.guild.id}/722524614768590889`)
						.setStyle(ButtonStyle.Link),
					new ButtonBuilder()
						.setCustomId('z')
						.setLabel(`${member.guild.memberCount}`)
						.setStyle(ButtonStyle.Secondary)
						.setDisabled(true)
				);
				Channel.send({ content: `<@${member.id}>`, embeds: [welEmbed], components: [row] });
			} else
				Channel.send({ content: `<@${member.id}>`, embeds: [welEmbed] });
		} catch (err) {
			console.log(err);
			console.log("error on guildMemberAdd\nthey prob deleted the channel.");
		}

		let nickData = await db.findOne({
			Guild: guild.id,
		});

		if (!nickData)
			nickData = await db.create({
				GuildName: guild.name,
				Guild: guild.id,
				User: user.id,
				UserTag: user.tag,
				Nicksys: false,
			});
		else await nickData.save();

		const regex = new RegExp(/[^\w\s\d\t\n\r~`!@#\$%\^&\*\(\)_\-\+={\[\}\]\|\\:;"'<,>\.\?\/\´ºª]/gi);
		// the function that generates the numbers
		const randomID = (length) => Math.floor(Math.random() * Math.pow(10, length));
		// replace 5 with how many characters you want
		randomID(3); // return example: 581
		const newnick = randomID(5);

		//if (nickData.Nicksys === false) console.log("nickData.nicksys === false");
		if (nickData.Nicksys === true) {
			//console.log("nickData.nicksys === true")
			//console.log(member)
			if (member.user.globalName.includes("Moderated Nickname ")) return; //console.log(`${newMember.user.tag} | ${newMember.user.id} already has a mod nickname: ${oldMember.nickname}`);
			const newNick = member.user.globalName || member.displayName;
			function countNKC(str) {
				const nonKeyboardChars = str.match(regex) || [];
				return nonKeyboardChars.length;
			}
			let num = countNKC(newNick);
			//console.log("num: " + num);
			if (num > 4 || newNick.length < 4) {
				//console.log("newNick: " + newNick + "\nnewNick length: " + newNick.length);
				const reason =
					"Your new nickname has more than 4 non QWERTY characters.\nPlease change it back and then message a mod so that they will remove the moderated nickname.";

				const newEmbed = new EmbedBuilder()
					.setColor(guild.members.me.displayHexColor || "DARK_GOLD")
					.setTitle(`Your nickname on \`${guild.name}\`has been changed!`)
					.setDescription(`It has been change to: \`Moderated Nickname ${newnick}\`.\n\`\`\`${reason}\`\`\``)
					.setTimestamp();
				try {
					member.setNickname("Moderated Nickname " + newnick);
				} catch (err) {
					console.log(err);
					console.log(`Couldn\'t change ${member.user} | ${member.user.id}`);
				}
				try {
					member.send({
						content: `<@${member.user.id}>`,
						embeds: [newEmbed],
					});
				} catch (err) {
					console.log(err);
					console.log(`Couldn\'t send a dm to ${member.user.tag}(${member.user.id})`);
				}
			}
		}
	},
};
