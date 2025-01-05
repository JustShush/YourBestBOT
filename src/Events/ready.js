const colors = require('colors');
const { Client, Events, ActivityType } = require("discord.js");
const { connect } = require("mongoose");
const cron = require('node-cron');
const { allGuilds } = require('../functions/allguilds');
const { RVotingRole } = require("../functions/votingRoleRemove.js");
const { checkGWs, deleteExpiredGW } = require('../functions/gwUtils.js');
const { rmTranscripts } = require('../functions/rmTranscripts.js');
const api = require("../api/app.js");

module.exports = {
	name: Events.ClientReady,
	once: true,
	/**
	 * @param {Client} client
	 */
	async execute(client) {

		connect(client.config.MONGO_URI, {}).then(() => console.log(colors.brightGreen("Connected to mongoDB")));

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
			if (!data) return console.log("couldn't find weekly data");
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
			rmTranscripts(); // Removes old transcripts
		}

		async function dayUpdate() {
			// This code will run only on the 1st day of the month
			//console.log('This code runs on the 1st day of every month.');
			// Put your code here that you want to run on the 1st day of the month
		}

		cron.schedule('0 0 1 * *', monthlyUpdate);
		cron.schedule('0 0 * * 0', weekUpdate);
		//cron.schedule('0 0 * * *', dayUpdate);

		//? Vote System
		await RVotingRole(client);
		setInterval(() => {
			RVotingRole(client).catch((err) => console.log(err));
		}, 600_000); // every hour 3_600_000

		//? Giveaway System
		setInterval(async () => {
			await checkGWs(client);
			await deleteExpiredGW();
		}, 30_000);

		client.guilds.cache.forEach(guild => {
			console.log(colors.brightRed(`${guild.name} | ${guild.id} | ${guild.memberCount} Members`));
		})

		allGuilds(client);

		console.log(colors.magenta.bold(`${client.user.username} is online!\nIn ${client.guilds.cache.size} Servers! ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} Members!`));
		api.load(client);
	}
}
