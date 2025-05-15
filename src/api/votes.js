const { EmbedBuilder } = require('discord.js');
const UserStats = require("../schemas/userStats.js");
const Stats = require("../schemas/stats.js");
const Votes = require("../schemas/votes.js");

/**
 * @typedef {import('express').Request} CustomRequest
 * @typedef {import('express').Response} CustomResponse
 * @param {CustomRequest} req
 * @param {CustomResponse} res
 */
module.exports = async (req, res, client) => {

	if (!req.headers.authorization)
		return res.status(401).send("Missing Authorization");
	if (client.config.API_SECRET !== req.headers.authorization)
		return res.status(403).send("Unauthorized");

	let obj = {}

	if (req.body)
		obj = { ...req.body }

	for (const key in req.query) {
		if (!(key in obj)) {
			obj[key] = req.query[key];
		}
	}

	if (obj.type !== "upvote")
		return console.log("IDK something other then \"upvote\"", obj.type);

	const user = await client.users.fetch(obj.user);
	if (!user) return console.log("There was a problem trying to fetch the Voting user.");
	if (user.bot) return ; // its dumb but idk just in case

	let userData = await UserStats.findOne({ UserId: obj.user });
	if (!userData) {
		userData = await UserStats.create({
			User: user.username,
			UserId: obj.user,
			Avatar: user.avatar,
			Banner: user.banner || "",
			Messages: 0,
			CmdCount: 0,
			Votes: {
				count: 0,
				last: Date.now()
			},
			isVoter: false
		})
	}
	if (!userData.Votes) userData.Votes = {};
	userData.Votes.count += 1;
	userData.Votes.last = Date.now();
	userData.isVoter = true;
	await userData.save().catch((err) => console.log("error idk", err));
	// General Stats
	const stats = await Stats.findOne();
	stats.votes.total = stats.votes.total + 1;
	stats.votes.current = stats.votes.current + 1;
	await stats.save();

	let avatar = user.avatarURL();
	if (user.avatar) avatar = `https://cdn.discordapp.com/avatars/${obj.user}/${user.avatar}.png`

	if (!client.guilds.cache.size) await client.guilds.fetch();
	let webex = await client.guilds.cache.get(client.config.config.votes.webex.guildId);
	if (!webex) webex = await client.guilds.fetch(client.config.config.votes.webex.guildId);
	let sup = await client.guilds.cache.get(client.config.config.votes.support.guildId);
	if (!sup) sup = await client.guilds.fetch(client.config.config.votes.support.guildId);

	const channels = [ await webex.channels.cache.get(client.config.config.votes.webex.voteChannel),
		await sup.channels.cache.get(client.config.config.votes.support.voteChannel)
	]; // comas // votes YBB Support

	let inWebex, inSup = false;

	for (const ch of channels) {
		if (webex) {
			if (!webex.members.cache.size) await webex.members.fetch();
			const member = await webex.members.cache.get(obj.user);
			if (!member) {
				console.log("couldn't find the ybb member " + __filename);
			} else {
				const role = await webex.roles.cache.get(client.config.config.votes.webex.roleId);
				if (!webex.roles.cache.size) await webex.roles.fetch();
				if (member.roles.cache.has(role)) {
					console.log(`${member} already has the vote role!`);
				} else {
					await member.roles.add(role).catch((err) => console.log("there was an error trying to give voter role", err));
				}
			}
		}
		if (sup) {
			if (!sup.members.cache.size) await sup.members.fetch();
			const member = await sup.members.cache.get(obj.user);
			if (!member) {
				console.log("couldn't find the sup member " + user.id + " " + __filename);
			} else {
				const role = await sup.roles.cache.get(client.config.config.votes.support.roleId);
				if (!sup.roles.cache.size) await sup.roles.fetch();
				if (member.roles.cache.has(role)) {
					console.log(`${member} already has the vote role!`);
				} else {
					await member.roles.add(role).catch((err) => console.log("there was an error trying to give voter role", err));
				}
			}
		}

		let currentTime = new Date();
		let twelveHoursLater = new Date(currentTime.getTime() + (12 * 60 * 60 * 1000));
		let unixTimestamp = Math.floor(twelveHoursLater.getTime() / 1000);
		let formattedTimestamp = `<t:${unixTimestamp}:R>`;

		const newEmbed = new EmbedBuilder()
			.setDescription(`## <a:tada:1210660276018618388> Thank you \`@${user.username}\` for voting! <a:tada:1210660276018618388>\nThey have already voted **${userData.Votes.count} times** \<3\<3\nYou will be able to vote again ${formattedTimestamp} on [top.gg](https://yourbestbot.pt/vote)`)
			.setColor(user.accentColor || "Blurple")
			.setThumbnail(avatar)

		ch.send({ embeds: [newEmbed] });
	}

	let votes = await Votes.findOne({ UserId: obj.user });
	if (!votes) {
		votes = await Votes.create({
			UserId: obj.user,
			last: Date.now(),
		})
	} else {
		votes.last = Date.now();
	}
	await votes.save();

	res.sendStatus(200);
}