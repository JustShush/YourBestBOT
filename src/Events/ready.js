const color = require('colors');
const { Client, Events, ActivityType } = require("discord.js");
const { connect } = require("mongoose");
const cron = require('node-cron');
const { allGuilds } = require('../functions/allguilds');
const api = require("../api/app.js");
const UserStats = require("../schemas/userStats.js");

module.exports = {
	name: Events.ClientReady,
	once: true,
	/**
	 * @param {Client} client
	 */
	async execute(client) {

		const options = [{
			type: ActivityType.Watching,
			text: `Over {servers} servers! 🙂`,
			status: "online",
		}, {
			type: ActivityType.Listening,
			text: " /help | yourbestbot.pt/support",
			status: "online"
		}, {
			type: ActivityType.Watching,
			text: `Over {users} Users!`,
			status: "online"
		}, {
			type: ActivityType.Listening,
			text: `new updates soon™`,
			status: "idle"
		}];

		let i = -1;
		setInterval(() => {
			i++;
			if (!options[i]) i = 0;
			client.user.setPresence({
				activities: [{
					name: options[i].text.replaceAll('{users}', client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)).replaceAll('{servers}', client.guilds.cache.size),
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

		const Stats = require("../schemas/stats.js");
		const { config, pretty } = require("../../config.json");

		async function monthlyUpdate() {
			const currentDate = new Date();
			console.log(currentDate, currentDate.getDate());
			// 1st day of the month
			if (currentDate.getDate() === 1) {
				const data = await Stats.findOne();
				if (!data) return console.log("couldn't find monthly data");
				//* Votes
				if (data.votes.total < data.votes.current)
					data.votes.total = data.votes.current;
				const diff = data.votes.current - data.votes.last;
				const current = data.votes.current;
				const total = data.votes.total;
				data.votes.diff = diff;
				data.votes.last = current;
				data.votes.current = 0;

				//* Servers
				const Sdiff = data.servers.current - data.servers.last;
				const Scurrent = data.servers.current;
				const Stotal = data.servers.total;
				data.servers.diff = Sdiff;
				data.servers.last = Scurrent;
				data.servers.current = 0;
				await data.save();
				const channel = await client.channels.cache.get(config.logs[1].id);
				await channel.send({ content: `${pretty.BlueSquare} **[MonthlyUpdate]:** Votes Total:${total} Diff:${diff} Last:${current}\nServers Total:${Stotal} Diff:${Sdiff} Last: ${Scurrent}` });
			}
		}

		async function weekUpdate() {
			const data = await Stats.findOne();
			if (!data) return console.log("couldn't find monthly data");
			//* Votes
			if (data.votes.total < data.votes.current)
				data.votes.total = data.votes.current;
			const diff = data.votes.current - data.votes.last;
			const current = data.votes.current;
			const total = data.votes.total;

			//* Servers
			const Sdiff = data.servers.current - data.servers.last;
			const Scurrent = data.servers.current;
			const Stotal = data.servers.total;
			const channel = await client.channels.cache.get(config.logs[1].id);
			await channel.send({ content: `${pretty.BlueSquare} **[WeeklyUpdate]:** Votes Total:${total} Diff:${diff} Last:${current}\nServers Total:${Stotal} Diff:${Sdiff} Last: ${Scurrent}` });
		}

		async function dayUpdate() {
			// This code will run only on the 1st day of the month
			console.log('This code runs on the 1st day of every month.');
			// Put your code here that you want to run on the 1st day of the month
		}

		async function rVoteRole() {
			console.log('12 timer', new Date().toLocaleString());
		}

		cron.schedule('0 0 1 * *', monthlyUpdate);
		cron.schedule('0 0 * * 0', weekUpdate);
		//cron.schedule('0 0 * * *', dayUpdate);
		cron.schedule('0 0 */12 * * *', rVoteRole);

		/* const users = await UserStats.find() // get all the users
		users.forEach(async (u) => {
			if (((new Date(u.votes.last).getTime() + 1000) - Date.now()) < 1) {
				const webex = client.guilds.cache.get(client.config.config.votes.webex.guildId);
				const sup = client.guilds.cache.get(client.config.config.votes.support.guildId);
				if (webex) {
					const member = webex.members.cache.get(u.UserId);
					const role = webex.roles.cache.get(client.config.config.votes.webex.roleId);
					await member.roles.remove(role).catch((err) => console.log("there was an error trying to remove voter role", err));
				}
				if (sup) {
					const member = webex.members.cache.get(u.UserId);
					const role = webex.roles.cache.get(client.config.config.votes.support.roleId);
					await member.roles.remove(role).catch((err) => console.log("there was an error trying to remove voter role", err));
				}
			}
		}) */

		client.guilds.cache.forEach(guild => {
			console.log(`${guild.name} | ${guild.id} | ${guild.memberCount} Members`.brightRed);
		})

		allGuilds(client);

		connect(client.config.MONGO_URI, {}).then(() => console.log("Connected to mongoDB".brightGreen));

		console.log(`${client.user.username} is online!\nIn ${client.guilds.cache.size} Servers!`.brightMagenta.bold);
		api.load(client);
	}
}
