/**
 * @typedef {import('express').Request} CustomRequest
 * @typedef {import('express').Response} CustomResponse
 * @param {CustomRequest} req
 * @param {CustomResponse} res
 */
module.exports = (req, res, client) => {

	res.status(200).send({
		serverCount: client.guilds.cache.size
	})
}