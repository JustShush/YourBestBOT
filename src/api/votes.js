const { EmbedBuilder } = require('discord.js');
const UserStats = require("../schemas/userStats.js");

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

	let data = await UserStats.findOne({ UserId: obj.user });
	if (!data) {
		data = await UserStats.create({
			User: user.username,
			UserId: user.id,
			Avatar: user.avatar,
			Banner: user.banner || "",
			Messages: 0,
			CmdCount: 0,
			Votes: 0,
		})
	}
	data.Votes = data.Votes + 1;
	await data.save().catch((err) => console.log("error idk", err));

	let avatar = user.avatarURL();
	if (user.avatar) avatar = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`

	// 704028617595682876
	const channels = ["704028617595682876","1208092080744702023"] // comas // bot-updates YBB Support

	channels.forEach(async (ch) => {

		let currentTime = new Date();
		let twelveHoursLater = new Date(currentTime.getTime() + (12 * 60 * 60 * 1000));
		let unixTimestamp = Math.floor(twelveHoursLater.getTime() / 1000);
		let formattedTimestamp = `<t:${unixTimestamp}:R>`;

		const c = await client.channels.cache.get(ch);

		const newEmbed = new EmbedBuilder()
			.setDescription(`## <a:tada:1210660276018618388> Thank you \`@${user.username}\` for voting! <a:tada:1210660276018618388>\nThey have already voted **${data.Votes} times** \<3\<3\nYou will be able to vote again ${formattedTimestamp} on [top.gg](https://yourbestbot.pt/vote)`)
			.setColor(user.accentColor || "Blurple")
			.setThumbnail(avatar)

		c.send({ embeds: [newEmbed] });
	})

	res.sendStatus(200);
}