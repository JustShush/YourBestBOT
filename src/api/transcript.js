const TTranscriptSchema = require('../schemas/TicketTranscripts.js');

/**
 * @typedef {import('express').Request} CustomRequest
 * @typedef {import('express').Response} CustomResponse
 * @param {CustomRequest} req
 * @param {CustomResponse} res
 */
module.exports = async (req, res) => {
	const ticketId = req.params.ticketid;

	const transcript = await TTranscriptSchema.findOne({ ticketId: ticketId });
	if (!transcript) return res.status(404).send('<h1>Transcript Not Found</h1>');

	const messages = transcript.messages;

	const messageCache = messages.reduce((cache, message) => {
		cache[message.id] = message;
		return cache;
	}, {});

/*
Transcript page coded by Noxic - https://github.com/noxic-dev 😀
*/

	const transcriptHTML = `
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,300;0,700&display=swap" rel="stylesheet">
		<title>Transcript - Ticket ${ticketId}</title>
		<style>
			:root {
    			--font-noto-sans: 'Noto Sans', sans-serif;
			}
			body {
    			font-family: var(--font-noto-sans);
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
				position: relative;
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
				position: relative;
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
			.reply {
				font-size: 0.9em;
				padding: 5px 10px;
				margin-bottom: 10px;
				border-left: 3px solid #3498DB;
				border-radius: 5px;
				color: #B9BBBE;
				cursor: pointer;
			}
			.reply a {
				color: #3498DB;
				text-decoration: none;
			}
			.reply a:hover {
				text-decoration: underline;
			}
			.reply-arrow {
				margin-right: 5px;
				color: #7F8C8D;
			}
			.highlight {
				background-color: #36393F;
				padding: 10px 15px;
				border-radius: 8px;
				width: 100%;
				position: relative;
				border: 1px solid rgb(255, 255, 255);
			}
			.guild-icon {
				width: 50px;
				height: 50px;
				border-radius: 50%;
			}
			.url {
			text-color: #5865F2;
			color: #5865F2;
			text: #5865F2;
			}
			.footer {
				text-align: center;
				margin-top: 20px;
				color: #7F8C8D;
				font-size: 0.9em;
			}
			.footer a {
				color: #3498DB;
				text-decoration: none;
			}
			.footer a:hover {
				text-decoration: underline;
			}
		</style>
	</head>
	<body>
		<div class="transcript-container">
			<h1>Transcript for Ticket ${ticketId}</h1>
			<img src="${transcript.guildIcon || 'https://cdn.discordapp.com/embed/avatars/0.png'}" alt="Guild Icon" class="guild-icon">
			${messages
				.map(msg => {
					let replyHTML = '';
					if (msg.reference) {
						const refMessage = messages.find(m => m.id === msg.reference)
						replyHTML = refMessage ? `
							<div class="reply" onclick="highlightMessage('${refMessage.id}')">
								<span class="reply-arrow">↩</span>
								Reply to ${refMessage.author}: ${truncateMessageContent(refMessage.content)}
							</div>
						` : "";
					}
					return `
						<div id="message-${msg.id}" class="message">
							<img src="${msg.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}" alt="Avatar" class="avatar">
							<div class="message-content">
								${replyHTML}
								<div class="message-header">
									<span class="author">${msg.author}</span>
									<span class="timestamp">${msg.timestamp}</span>
								</div>
								<div class="content">${formatMessageContent(msg.content, messages)}</div>
							</div>
						</div>
					`;
				})
				.join('')}
		</div>
		<div class="footer">
			Made with ❤ by <a href="https://github.com/JustShush" target="_blank">JustShush</a> <br>
			Transcript page coded by <a href="https://github.com/noxic-dev" target="_blank">Noxic</a>
		</div>
<script>
    function highlightMessage(messageId) {
        const message = document.getElementById('message-' + messageId).querySelector('.message-content');
        console.log(message);
        if (message) {
            message.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            toggleClasses(message);
        }
    }

    function toggleClasses(message) {
        let times = 0;
        const interval = 350;

        const loop = setInterval(() => {
            if (times < 5) {
                message.classList.add('highlight');
                message.classList.remove('message-content');

                setTimeout(() => {
                    message.classList.remove('highlight');
                    message.classList.add('message-content');
                }, interval);

                times++;
            } else {
                clearInterval(loop);
            }
        }, interval * 2);
    }
</script>

	</body>
	</html>
	`;

	res.send(transcriptHTML);
};

function formatMessageContent(content, messages) {
    let message = content;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    
    message = message.replace(urlRegex, (url) => `<a href="${url}" class="url" target="_blank">${url}</a>`);
    
    const args = message.split(" ");
    
    args.forEach((arg, index) => {
        if (arg.startsWith("<@") && arg.endsWith(">")) {
            const userId = arg.slice(2, -1);
            const user = messages.find(m => m.authorId === userId);
            
            if (user) {
                args[index] = `@${user.author}`;
            } else {
                args[index] = "@unknown" + " " + "(" + userId + ")";
            }
        }
    });
    message = args.join(" ");

    return message;
}

function truncateMessageContent(content) {
	const maxLength = 50;
	return content.length > maxLength ? `${content.substring(0, maxLength)}...` : content;
}
