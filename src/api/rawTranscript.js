/**
 * @typedef {import('express').Request} CustomRequest
 * @typedef {import('express').Response} CustomResponse
 * @param {CustomRequest} req
 * @param {CustomResponse} res
 */
const TTranscriptSchema = require('../schemas/TicketTranscripts.js');

module.exports = async (req, res) => {

	const { tid } = req.query;
	if (!tid) return res.status(400).json({ ticket: null })
	const transcript = await TTranscriptSchema.findOne({ ticketId: tid });
	if (!transcript) return res.status(404).json({ ticket: null })
	else return res.status(200).json(transcript)
}