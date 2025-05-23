const db = require("../schemas/stickySys.js");

async function sticky(message) {
	let data = await db.findOne({
		GuildId: message.guild.id
	});

	if (!data) return;
	const dataFind = data.stickys.find(o => o.ChannelID == message.channel.id);
	if (!dataFind) return;
	const channel = dataFind.ChannelID;
	if (message.channel.id == channel) {
		if (message.id != dataFind.MSGID) {
			const msg = dataFind.MSG.replace(/\\n/g, '\n');
			const fetchedMessage = await message.channel.messages.fetch(dataFind.MSGID).catch((err) => console.error(err, `Tried to fetch the sticky msg but something went wrong.`));;
			if (fetchedMessage)
				fetchedMessage.delete().catch((err) => console.error(err, `Tried to delete a sticky msg but something went wrong.`));
			const sentMsg = await message.channel.send({ content: msg });
			dataFind.MSGID = sentMsg.id;
			await data.save();
		}
	}
}

module.exports = { sticky };