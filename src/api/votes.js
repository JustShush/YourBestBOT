const { EmbedBuilder } = require('discord.js');
const UserStats = require("../schemas/userStats.js");
const Stats = require("../schemas/stats.js");

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
			UserId: user.id,
			Avatar: user.avatar,
			Banner: user.banner || "",
			Messages: 0,
			CmdCount: 0,
			Votes: {
				count: 0,
				last: Date.now()
			},
		})
	}
	if (!userData.Votes) userData.Votes = {};
	userData.Votes.count += 1;
	userData.Votes.last = Date.now();
	await userData.save().catch((err) => console.log("error idk", err));
	// General Stats
	const stats = await Stats.findOne();
	stats.votes.total = stats.votes.total + 1;
	stats.votes.current = stats.votes.current + 1;
	await stats.save();

	let avatar = user.avatarURL();
	if (user.avatar) avatar = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`

	const channels = [ client.config.config.votes.webex.voteChannel,
		client.config.config.votes.support.voteChannel
	]; // comas // votes YBB Support

	channels.forEach(async (ch) => {
		const webex = client.guilds.cache.get(client.config.config.votes.support.guildId);
		const sup = client.guilds.cache.get(client.config.config.votes.support.guildId);
		if (webex) {
			const member = webex.members.cache.get(user.id);
			const role = webex.roles.cache.get(client.config.config.votes.webex.roleId);
			if (member.roles.has(role)) return console.log(`${member} already has the vote role!`);
			await member.roles.add(role).catch((err) => console.log("there was an error trying to give voter role", err));
		}
		if (sup) {
			const member = sup.members.cache.get(user.id);
			const role = sup.roles.cache.get(client.config.config.votes.support.roleId);
			if (member.roles.has(role)) return console.log(`${member} already has the vote role!`);
			await member.roles.add(role).catch((err) => console.log("there was an error trying to give voter role", err));
		}

		let currentTime = new Date();
		let twelveHoursLater = new Date(currentTime.getTime() + (12 * 60 * 60 * 1000));
		let unixTimestamp = Math.floor(twelveHoursLater.getTime() / 1000);
		let formattedTimestamp = `<t:${unixTimestamp}:R>`;

		const c = await client.channels.cache.get(ch);

		const newEmbed = new EmbedBuilder()
			.setDescription(`## <a:tada:1210660276018618388> Thank you \`@${user.username}\` for voting! <a:tada:1210660276018618388>\nThey have already voted **${userData.Votes.count} times** \<3\<3\nYou will be able to vote again ${formattedTimestamp} on [top.gg](https://yourbestbot.pt/vote)`)
			.setColor(user.accentColor || "Blurple")
			.setThumbnail(avatar)

		c.send({ embeds: [newEmbed] });
	})

	res.sendStatus(200);
}