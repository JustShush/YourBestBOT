const color = require('colors');
const { Events, ActivityType } = require("discord.js");
const { connect } = require("mongoose");
const { allGuilds } = require('../functions/allguilds');
const api = require("../api/app.js");

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {

		const options = [{
			type: ActivityType.Watching,
			text: `Over ${client.guilds.cache.size} servers! 🙂`,
			status: "online",
		}, {
			type: ActivityType.Listening,
			text: " /help | yourbestbot.pt/support",
			status: "online"
		}, {
			type: ActivityType.Watching,
			text: `Over ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} Users!`,
			status: "online"
		}, {
			type: ActivityType.Listening,
			text: `new updates soon™`,
			status: "idle"
		}];

		let i = 0;
		setInterval(() => {
			i++;
			if (!options[i]) i = 0;
			client.user.setPresence({
				activities: [{
					name: options[i].text,
					type: options[i].type,
				}],
				status: options[i].status,
			})
		}, 5 * 60 * 1000);

		const upTimeFunction = () => {
			let totalSeconds = (client.uptime / 1000);
			let days = Math.floor(totalSeconds / 86400);
			totalSeconds %= 86400;
			let hours = Math.floor(totalSeconds / 3600);
			totalSeconds %= 3600;
			let minutes = Math.floor(totalSeconds / 60);
			let seconds = Math.floor(totalSeconds % 60);

			/* if (days == 1) {
				// execute reload of the events
				for (const [key, value] of client.events)
					client.removeListener(`${key}`, value, true);
				loadEvents(client);
				// execute realod of the commands
				loadCommands(client);
				console.log("Events and Commands Reloaded.");
			} */
			if (days == 31) {
				console.log(`${client.user.username} 31 dias!`.brightRed)
				Channel.send({ content: `឵\n\n\n\n**${client.user} is GODLIKE!!!!**\n\n\n\n឵ \n||<@453944662093332490>||` })
			}
			setTimeout(upTimeFunction, 1000)
		}
		upTimeFunction()

		client.guilds.cache.forEach(guild => {
			console.log(`${guild.name} | ${guild.id} | ${guild.memberCount} Members`.brightRed);
		})

		allGuilds(client);

		connect(client.config.MONGO_URI, {}).then(() => console.log("Connected to mongoDB".brightGreen));

		console.log(`${client.user.username} is on-line!\nIn ${client.guilds.cache.size} Servers!`.brightMagenta.bold);
		api.load(client);
	}
}