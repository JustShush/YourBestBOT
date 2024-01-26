// DiscordBOT2.0
const color = require('colors');
const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const { Guilds, GuildMembers, GuildMessages, GuildPresences, MessageContent, GuildInvites } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember, Reaction } = Partials;
const api = require("./api/app.js")

const client = new Client({
	intents: [Guilds, GuildMembers, GuildMessages, GuildPresences, MessageContent, GuildInvites],
	partials: [User, Message, GuildMember, ThreadMember, Reaction],
});

api.load(client);

const { loadEvents } = require("./handlers/event_Handler");

client.config = require("../config.json");
client.events = new Collection();
client.commands = new Collection();
client.subCommands = new Collection();

loadEvents(client);

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

client.login(client.config.TOKEN);