// DiscordBOT2.0
const color = require('colors');
const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Partials, Collection, Message } = require("discord.js");
const { Guilds, GuildMembers, GuildMessages, GuildPresences, MessageContent, GuildInvites } = GatewayIntentBits;

const client = new Client({
	intents: [Guilds, GuildMembers, GuildMessages, GuildPresences, MessageContent, GuildInvites],
	partials: [Partials.User, Partials.Message, Partials.GuildMember, Partials.ThreadMember, Partials.Reaction],
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