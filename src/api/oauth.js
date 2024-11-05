const { clientId, redirect_url } = require('../../config.json');

/**
 * @typedef {import('express').Request} CustomRequest
 * @typedef {import('express').Response} CustomResponse
 * @param {CustomRequest} req
 * @param {CustomResponse} res
 */
module.exports = (req, res) => {
	const redirectUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirect_url)}&response_type=code&scope=identify guilds`;
	res.redirect(redirectUrl);
}