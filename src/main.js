// DiscordBOT2.0
const color = require('colors');
const { Client, GatewayIntentBits, Partials, Collection, ClientVoiceManager } = require("discord.js");
const { Guilds, GuildMembers, GuildMessages, GuildPresences } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

const client = new Client({
	intents: [Guilds, GuildMembers, GuildMessages, GuildPresences],
	partials: [User, Message, GuildMember, ThreadMember],
});

const { loadEvents } = require("./handlers/event_Handler");

client.config = require("../config.json");
client.events = new Collection();
client.commands = new Collection();
client.subCommands = new Collection();

loadEvents(client);

client.login(client.config.TOKEN);