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
	const { discordId, amount, type } = req.body;
	try {
		const charge = await axios.post(
			'https://api.commerce.coinbase.com/charges',
			{
				name: 'Discord Donation',
				description: `Donation from ${discordId}`,
				local_price: {
					amount: amount,
					currency: 'USD',
				},
				pricing_type: 'fixed_price',
				metadata: { discordId },
			},
			{
				headers: {
					'X-CC-Api-Key': client.config.COINBASE_API_KEY,
					'X-CC-Version': '2018-03-22',
				},
			}
		);

		res.json({ hosted_url: charge.data.data.hosted_url });
	} catch (err) {
		res.status(500).json({ error: 'Failed to create donation' });
	}
}