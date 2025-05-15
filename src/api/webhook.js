const axios = require('axios');
const { Client } = require("discord.js");

/**
 * @typedef {import('express').Request} CustomRequest
 * @typedef {import('express').Response} CustomResponse
 * @param {CustomRequest} req
 * @param {CustomResponse} res
 * @param {Client} client
 */
module.exports = async (req, res, client) => {
	const event = req.body.event;

	if (event.type === 'charge:pending') {
		// user paid, but transaction not confirm on blockchain yet
	}

	if (event.type === 'charge:confirmed') {
		const discordId = event.data.metadata.discordId;

		try {
			await axios.post("https://discord.com/api/webhooks/" + client.config.whSafetyComas, {
				username: "CoinBase Commerce Donation",
				content: `Somebody completed a donation`
			});
			console.log(`Gave role to ${discordId}`);
		} catch (e) {
			console.log('Error when someone completed the donation' + __filename)
			console.error(e);
		}
	}

	if (event.type === 'charge:failed') {
		// charge failed or expired
	}

	res.sendStatus(200);
}