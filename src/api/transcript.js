const TTranscriptSchema = require('../schemas/TicketTranscripts.js');

/**
 * @typedef {import('express').Request} CustomRequest
 * @typedef {import('express').Response} CustomResponse
 * @param {CustomRequest} req
 * @param {CustomResponse} res
 */
module.exports = async (req, res) => {

	const ticketId = req.params.ticketid;

	// Check if transcript exists
	const transcript = await TTranscriptSchema.findOne({ ticketId: ticketId });
	if (!transcript) return res.status(404).send('<h1>Transcript Not Found</h1>');

	const messages = transcript.messages;

	const transcriptHTML = `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Transcript - Ticket ${ticketId}</title>
			<style>
				body { font-family: Arial, sans-serif; margin: 20px; background-color: #36393F; }
				.message { margin-bottom: 10px; color: white; }
				.author { font-weight: bold; color: #3498db; }
				.timestamp { font-size: 0.9em; color: #7f8c8d; }
			</style>
		</head>
		<body>
			<h1>Transcript for Ticket ${ticketId}</h1>
			<div>
				${messages
			.map(
				msg => `
							<div class="message">
								<span class="timestamp">[${msg.timestamp}]</span>
								<span class="author">${msg.author}:</span>
								<span class="content">${formatMessageContent(msg.content)}</span>
							</div>
						`
			)
			.join('')}
			</div>
		</body>
		</html>
	`;

	res.send(transcriptHTML);
}

function formatMessageContent(content) {
	const urlRegex = /(https?:\/\/[^\s]+)/g;
	// Replace URLs with clickable links
	return content.replace(urlRegex, (url) => `<a href="${url}" target="_blank">${url}</a>`);
}
