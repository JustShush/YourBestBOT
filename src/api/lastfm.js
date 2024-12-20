const { Client } = require("discord.js");
const axios = require('axios');

/**
 * @typedef {import('express').Request} CustomRequest
 * @typedef {import('express').Response} CustomResponse
 * @param {CustomRequest} req
 * @param {CustomResponse} res
 * @param {Client} client
 */
module.exports = async (req, res, client) => {

	let API_KEY;
	const username = req.params.username || req.query.username;
	const lastfmKey = req.params.lastfmKey || req.query.lastfmKey;
	if (!username)
		res.status(400).send("username is required!");

	if (username.toLowerCase() == 'justshush')
		API_KEY = client.config.LastFMJustShushKey;
	if (!API_KEY && lastfmKey) API_KEY = lastfmKey;
	console.log(`${username} => ${API_KEY}`)

	try {
		const response = await axios.get(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${API_KEY}&format=json`);
		const tracks = response.data.recenttracks.track;

		if (tracks && tracks[0]) {
			const currentTrack = tracks[0];
			const songName = currentTrack.name;
			const artistName = currentTrack.artist['#text'];
			const url = currentTrack.url;
			console.log(url);

			if (currentTrack['@attr'] && currentTrack['@attr'].nowplaying) {
				return res.status(200).send(`🎵 Currently playing: "${songName}" by ${artistName}`);
			} else {
				return res.status(200).send(`🎵 Last played: "${songName}" by ${artistName}`);
			}
		} else
			return res.status(200).send('No recent tracks found.');
	} catch (error) {
		console.log(error);
		res.status(500).send('Error fetching song data.');
	}
}