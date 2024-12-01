// Author https://github.com/justshush
const { Client } = require("discord.js");

/**
 * @typedef {import('express').Request} CustomRequest
 * @typedef {import('express').Response} CustomResponse
 * @param {CustomRequest} req
 * @param {CustomResponse} res
 * @param {Client} client
 */
module.exports = (req, res, client) => {
	res.status(404).send({ message: `Accesible routes: /login, /oauth, /membercount/id, /servercount and /commands` });
}
