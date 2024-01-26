module.exports = (req, res, client) => {

	res.status(200).send({
		serverCount: client.guilds.cache.size
	})
}