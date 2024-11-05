const { clientId, clientSecret, redirect_url } = require('../../config.json');
const axios = require('axios');

/**
 * @typedef {import('express').Request} CustomRequest
 * @typedef {import('express').Response} CustomResponse
 * @param {CustomRequest} req
 * @param {CustomResponse} res
 */
module.exports = async (req, res) => {
	const { code } = req.query;
	const userIp = req.headers['x-forwarded-for'];

	if (!code)
		return res.status(400).send('No code provided');

	try {
		// Exchange code for an access token
		const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
			client_id: clientId,
			client_secret: clientSecret,
			grant_type: 'authorization_code',
			code: code,
			redirect_uri: redirect_url
		}).toString(), {
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		});

		const { access_token } = tokenResponse.data;

		// Use the access token to get user info
		const userResponse = await axios.get('https://discord.com/api/users/@me', {
			headers: { Authorization: `Bearer ${access_token}` }
		});

		// Fetch the user's guilds
		const guildsResponse = await axios.get('https://discord.com/api/users/@me/guilds', {
			headers: { Authorization: `Bearer ${access_token}` }
		});

		const userData = userResponse.data;
		const userGuilds = guildsResponse.data;

		// Include the user's IP address in the response (for logging or checking purposes)
		res.json({
			user: userData,
			guilds: userGuilds,
			ip: userIp
		});
	} catch (error) {
		console.error(error);
		res.status(500).send('Authentication failed');
	}
}