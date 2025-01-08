const { Client } = require("discord.js");

/**
 * @typedef {import('express').Request} CustomRequest
 * @typedef {import('express').Response} CustomResponse
 * @param {CustomRequest} req
 * @param {CustomResponse} res
 * @param {Client} client
 */
module.exports = (req, res, client) => {
    res.status(404).send({ 
        message: `Mhm, it seems I couldn't find this route. Available routes: /oauth, /membercount/id, /servercount, /lastfm, /votes and /commands` 
    });
};
