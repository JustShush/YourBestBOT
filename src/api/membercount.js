/**
 * @typedef {import('express').Request} CustomRequest
 * @typedef {import('express').Response} CustomResponse
 * @param {CustomRequest} req
 * @param {CustomResponse} res
 */
module.exports = (req, res, client) => {

	const { id } = req.params;

	if (id == 0)
		return res.status(200).send({
			memberCount: client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)
		});

	const guild = client.guilds.cache.get(id);
	if (!guild)
		return res.status(404).send({ message: `Couldn't find a guild with id: ${id}` });

	res.status(200).send({
		memberCount: guild.memberCount
	})
}