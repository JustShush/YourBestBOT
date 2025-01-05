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
			body {
				font-family: Arial, sans-serif;
				margin: 20px;
				background-color: #2C2F33;
				color: #FFFFFF;
			}
			.transcript-container {
				max-width: 800px;
				margin: 0 auto;
			}
			.message {
				display: flex;
				align-items: flex-start;
				margin-bottom: 15px;
			}
			.avatar {
				width: 40px;
				height: 40px;
				border-radius: 50%;
				margin-right: 10px;
			}
			.message-content {
				background-color: #36393F;
				padding: 10px 15px;
				border-radius: 8px;
				width: 100%;
			}
			.message-header {
				display: flex;
				justify-content: space-between;
				font-size: 0.9em;
				margin-bottom: 5px;
			}
			.author {
				font-weight: bold;
				color: #3498DB;
			}
			.timestamp {
				color: #7F8C8D;
				font-size: 0.8em;
			}
			.content {
				font-size: 1em;
				color: #FFFFFF;
			}
		</style>
	</head>
	<body>
		<div class="transcript-container">
			<h1>Transcript for Ticket ${ticketId}</h1>
			${messages
				.map(
					msg => `
						<div class="message">
							<img src="${msg.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}" alt="Avatar" class="avatar">
							<div class="message-content">
								<div class="message-header">
									<span class="author">${msg.author}</span>
									<span class="timestamp">${msg.timestamp}</span>
								</div>
								<div class="content">${formatMessageContent(msg.content)}</div>
							</div>
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
