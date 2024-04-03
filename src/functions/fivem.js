const axios = require('axios');

/**
 * Get the number of players, server name and server logo url from the cfx server website
 * @param {String} url https://cfx.re/join/code
 */
async function getServerStatus(url) {
	try {
		const obj = {};
		const response = await axios.get(url);
		const html = response.data;

		// player count
		const playersRegex = /<span class="players"><span class="material-icons">people_outline<\/span>\s*([^<]*)<\/span>/;
		const playersMatch = html.match(playersRegex);

		const playersTextContent = playersMatch ? playersMatch[1].trim() : null;
		if (playersTextContent) obj.playercount = playersTextContent;
		else obj.playercount = null;

		// server name
		const titleRegex = /<title>(.*?)<\/title>/;
		const titleMatch = html.match(titleRegex);

		const serverName = titleMatch ? titleMatch[1] : null;
		if (serverName) obj.name = serverName;
		else obj.name = null;

		// server image url
		const imageRegex = /<meta property="og:image" content="(.*?)"/;
		const imageMatch = html.match(imageRegex);

		const imageUrl = imageMatch ? imageMatch[1] : null;
		if (imageUrl) obj.logo = imageUrl;
		else obj.logo = null;

		//console.log('Text content inside players class:', playersTextContent);
		//console.log('Server Name:', serverName);
		//console.log('Image URL:', imageUrl);
		return obj;
	} catch (error) {
		console.error('Error fetching HTML:', error);
		return null;
	}
}

module.exports = { getServerStatus };