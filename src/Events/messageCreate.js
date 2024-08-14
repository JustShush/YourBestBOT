const { PermissionFlagsBits, TextChannel, EmbedBuilder, ChannelType } = require("discord.js");
const Schema = require("../schemas/stats.js");
const UserStats = require("../schemas/userStats.js");
const { sticky } = require("../functions/sticky.js");
const { stealEmoji } = require("../functions/stealEmoji.js");

module.exports = {
	name: "messageCreate",
	commandsArr: ["steal"],
	async execute(message, client) {
		if (client.user.id == message.author.id) return;
		sticky(message);
		if (message.author.bot) return;
		let data = await Schema.findOne()
		if (!data) {
			data = await Schema.create({
				NMessages: 1,
				NUsedCmd: 0
			})
			console.log("something went wrong when trying tog get bot stats");
		}
		if (!data.servers) {
			data.servers = {
				total: client.guilds.cache.size,
				current: client.guilds.cache.size,
				last: 0,
				diff: client.guilds.cache.size
			}
		}
		data.NMessages = data.NMessages + 1;
		await data.save();

		let userData = await UserStats.findOne({ UserId: message.author.id });
		if (!userData) {
			userData = await UserStats.create({
				User: message.author.username,
				UserId: message.author.id,
				Avatar: message.author.avatar,
				Banner: message.author.banner || "",
				Messages: 0,
				CmdCount: 0,
				Votes: {
					count: 0
				},
			})
		}
		if (userData.Avatar != message.author.avatar) userData.Avatar = message.author.avatar;
		userData.Messages = userData.Messages + 1;
		await userData.save();

		const PREFIXES = ["+", "ybb"];
		const prefix = PREFIXES.find((prefix) => {
			if (message.content.toLowerCase().startsWith(prefix)) return true;
			// Check if the prefix is separated by a space
			const words = message.content.toLowerCase().split(' ');
			return words.length > 1 && words[0] === prefix.toLowerCase();
		}) || "<@!${client.user.id}>" || "<@${client.user.id}>";
		const args = message.content.slice(prefix.length).trim().split(/ +/);
		const command = args.shift().toLowerCase();
		if (message.guild.id == "702545447750860931" || message.guild.id == "1054090158779150376")
			detect(message);
		if (command === 'steal') {
			if (!(message.member.permissions.has(PermissionFlagsBits.ManageGuildExpressions))) return message.channel.send({ content: `You don't have the required permissions to run this command.` }).then((msg) => { setTimeout(() => { msg.delete(); }, 5 * 1000); })
			stealEmoji(message, args);
		} else if (command == 'eval') {
			myEval(message, args);
		} else if (command == 'inv') {
			getInv(client, message, args);
		}
	},
};

async function getInv(client, message, args) {
	if (message.author.id !== '453944662093332490') return message.channel.send("sorry, this command is only for the developer")
	const guild = await client.guilds.cache.get(args[0]);
	let found = guild.channels.cache.find(
		(channel) => channel.type === ChannelType.GuildText && channel.permissionsFor(guild.members.me).has("SendMessages")
	);
	let invites = await guild.invites.fetch().catch(err => { message.reply({ content: "couldnt fetch the invites in this server! | " + guild.name + " | " + guild.id }); return; });
	if (!invites) return;
	// Check if the bot has any invites for this server
	const botInvites = await invites.filter((invite) => invite.inviterId === client.user.id);
	let invite = botInvites.values().next().value;
	if (botInvites.size <= 0) {
		invite = await found.createInvite({
			maxAge: 0,
			maxUses: 0,
		}).catch(err => message.reply("couldnt create a new invite! IG Im missing perms in that server \:(", err));
	}
	const newEmbed = new EmbedBuilder()
		.setAuthor({ name: guild.name })
		.setDescription(`GuildName: \`${guild.name}\` | id: \`${guild.id}\`\nOwner: <@!${guild.ownerId}> | ${guild.ownerId}`)
		.addFields(
			{ name: `Number of members:`, value: `${guild.memberCount}` },
			{ name: `Invite:`, value: `\`discord.gg/${invite.code}\`` }
		)
		.setThumbnail(guild.iconURL())
		.setTimestamp();

	await message.reply({ content: 'discord.gg/' + invite, embeds: [newEmbed]})
}

async function myEval(message, args) {
	if (message.author.id !== '453944662093332490') return message.channel.send("sorry, this command is only for the developer")

	const command = args.join(" ");
	if (!command) return message.channel.send("you must write a command ")

	let words = ["token", "destroy", "config"]
	if (words.some(word => message.content.toLowerCase().includes(word))) {
		return message.channel.send("Those words are blacklisted!")
	}

const clean = text => {
            if (typeof (text) === "string")
                return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else
                return text;
        }

	try {
		const evaled = await eval(command)
		if (typeof evaled !== "string") evaled = require('util').inspect(evaled, {depth: 3});
		message.channel.send({ content: `\`\`\`js\n${clean(evaled)}\`\`\`` });

	} catch (error) {
		const embedfailure = new EmbedBuilder()
			.setColor("#FF0000")
			.addFields({ name: `Entrance`, value: `\`\`\`js\n${command}\`\`\`` })
			.addFields({ name: `Error`, value: `\`\`\`js\n${error}\`\`\` ` })

		message.channel.send({ embeds: [embedfailure] })
	}
}

async function detect(message) {
	const messageLinkRegex = /https:\/\/discord\.com\/channels\/(\d+)\/(\d+)\/(\d+)/;
	const match = message.content.match(messageLinkRegex);
	if (match) {
		const [, serverId, channelId, messageId] = match;

		// Ensure the linked message is within the same server
		if (serverId === message.guild.id) {
			try {
				const linkedChannel = message.guild.channels.cache.get(channelId);
				if (linkedChannel && linkedChannel instanceof TextChannel) {
					const linkedMessage = await linkedChannel.messages.fetch(messageId);
					//console.log(linkedMessage);

					const authorEmbed = new EmbedBuilder()
						.setAuthor({ name: linkedMessage.author.globalName, iconURL: linkedMessage.author.avatarURL() })
						.setColor(message.guild.members.me.displayHexColor)

					const footerEmbed = new EmbedBuilder()
						.setFooter({ text: linkedMessage.author.bot ? `@${linkedMessage.author.username}` : `@${linkedMessage.author.globalName}`, iconURL: linkedMessage.author.avatarURL() })
						.setColor(message.guild.members.me.displayHexColor)

					const obj = {
						embeds: [],
					}

					// for gifs add just the first frame to the image and the link of the video to the description
					if (linkedMessage.content)
						authorEmbed.setDescription(linkedMessage.content);
					if (linkedMessage.attachments.size > 0)
						authorEmbed.setImage(`${linkedMessage.attachments.first().url}`)
					if (linkedMessage.embeds.length > 0) {
						obj.embeds.push(footerEmbed);
						obj.embeds.push(linkedMessage.embeds[0]);
					} else
						obj.embeds.push(authorEmbed);
					//message.reply(`Content of the linked message: ${linkedMessage.content}`, { allowedMentions: { repliedUser: false } });
					return message.reply(obj, { mention: false });
				} else {
					message.reply('The linked channel is not accessible or is not a text channel.');
				}
			} catch (error) {
				console.error('Error fetching linked message:', error);
			}
		}
	}
}
