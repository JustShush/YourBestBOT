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
		// Check if the property is not already present in newData
		if (!(key in obj)) {
			// Add the property to newData
			obj[key] = req.query[key];
		}
	}
	console.log(obj);

	if (obj.type !== "upvote")
		return console.log("IDK something other then \"upvote\"", obj.type);

	const user = await client.users.fetch(obj.user);
	console.log(user);
	if (!user) return console.log("There was a problem trying to fetch the Voting user.");
	if (user.bot) return ; // its dumb but idk just in case

	let Data = UserStats.findOne({ UserId: obj.user });
	if (!Data) {
		Data = await UserStats.create({
			User: user.username,
			UserId: user.id,
			Avatar: user.avatar,
			Banner: user.banner || "",
			Messages: 0,
			CmdCount: 0,
			Votes: 0,
		})
	}
	Data.Votes = Data.Votes + 1;
	await Data.save().catch((err) => console.log("error idk", err));

	let avatar = user.avatarURL();
	if (user.avatar) avatar = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`

	const channels = ["704028617595682876", "1208092080744702023"] // comas // bot-updates YBB Support

	channels.forEach((ch) => {

		const newEmbed = new EmbedBuilder()
			.setTitle(`Thank you @${user.username} for voting!`)
			.setDescription(`You have already voted **${data.Votes} times** \<3\<3`)
			.setThumbnail(avatar)

		ch.send({ embeds: [newEmbed] });
	})

	res.sendStatus(200);
}