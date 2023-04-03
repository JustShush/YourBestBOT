// DiscordBOT2.0
const color = require('colors');
const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const { Guilds, GuildMembers, GuildMessages, GuildPresences, MessageContent } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember, Reaction } = Partials;

const client = new Client({
	intents: [Guilds, GuildMembers, GuildMessages, GuildPresences, MessageContent],
	partials: [User, Message, GuildMember, ThreadMember, Reaction],
});

const { loadEvents } = require("./handlers/event_Handler");

client.config = require("../config.json");
client.events = new Collection();
client.commands = new Collection();
client.subCommands = new Collection();

loadEvents(client);

client.login(client.config.TOKEN);