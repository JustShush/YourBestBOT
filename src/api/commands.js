const { Client } = require("discord.js");

/**
 * @typedef {import('express').Request} CustomRequest
 * @typedef {import('express').Response} CustomResponse
 * @param {CustomRequest} req
 * @param {CustomResponse} res
 * @param {Client} client
 */
module.exports = (req, res, client) => {
	res.status(200).send({ cmds: client.commands });
}