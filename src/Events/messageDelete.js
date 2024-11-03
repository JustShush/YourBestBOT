const { EmbedBuilder } = require("discord.js");
const logs = require("../schemas/log.js");

module.exports = {
	name: "messageDelete",
	async execute(message, client) {
		if (message.author == null || message.author.bot) return;
		if (message.partial) await message.fetch();
		const data = await logs.findOne({ Guild: message.guild.id });
		if (!data) return;
		const newEmbed = new EmbedBuilder()
			.setAuthor({ name: message.author.globalName, iconURL: message.author.displayAvatarURL() })
			.setColor("#FF0000")
			.setFooter({ text: `User ID: ${message.author.id}` })
			.setTimestamp()

		let embedContent = `Message deleted in ${message.channel}\n`;
		if (message.content.length > 0) {
			embedContent += `**Content:**\n${message.content}`;
			newEmbed.setDescription(embedContent);
		}
		if (message.attachments.size > 0)
			newEmbed.setImage(`${message.attachments.first().url}`)

		const webhookId = data.General.webhookId;
		const webhook = await client.fetchWebhook(webhookId);
		if (webhook) await webhook.send({ embeds: [newEmbed] });
	},
};
