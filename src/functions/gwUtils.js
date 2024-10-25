const { Client, ButtonInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const gwSchema = require('../schemas/gwSchema.js');

/**
 * @param {Array} arr
 */
function shuffledArray(arr) {
	const shuffledArray = arr.slice();

	for (let i = shuffledArray.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
	}
	return shuffledArray;
};

async function deleteExpiredGW() {
	try {
		const giveaways = await gwSchema.find();
		const expirationTime = new Date(Date.now() - 3 * 60 * 1000);

		giveaways.forEach(async (gw) => {
			if (gw.Ended) {
				await gwSchema.deleteMany({
					updatedAt: { $lte: expirationTime },
				});
				return;
			}
		})
	} catch (err) {
		console.log('ERROR: in gw utils: ' + __filename);
		console.log(err);
	}
}

/**
 * @param {Client} client
 */
async function checkGWs(client) {
	try {
		const giveaways = await gwSchema.find();
		giveaways.forEach(async gw => {
			const channel = client.channels.cache.get(gw.ChannelId);
			const message = await channel.messages.fetch(gw.MessageId).catch(err => { return console.log(err); });

			const row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId('z')
						.setLabel("🎉")
						.setStyle(ButtonStyle.Primary)
						.setDisabled(true)
				)

			let shuffledParticipants = shuffledArray(gw.Participants.slice());

			const winners = shuffledParticipants.slice(0, gw.WinnerCount);

			if (!winners.length) {
				if (gw.Ended) return;
				if (gw.Paused) return;

				const newEmbed = new EmbedBuilder()
					.setTitle('`🛑` Giveaway Ended!')
					.setDescription(`This giveaway ended <t:${Math.floor(gw.EndTimestamp / 1000)}:R>`)
					.setColor('#FFFFFF')
					.addFields(
						{ name: '`👤` Entries', value: `\`${gw.Participants.length}\``, inline: true },
						{ name: '`🏆` Winners', value: '*No one entered the giveaway*', inline: true }
					)

				const endMessage = await message.edit({ embeds: [newEmbed], components: [row] });

				endMessage.reply({ content: `*Giveaway ended, but no one joined the giveaway.* [↗](https://discord.com/channels/${endMessage.guildId}/${endMessage.channelId}/${endMessage.id})` });

				gw.Ended = true;
				await giveaways.save().catch(err => console.log(err));
			} else {
				if (gw.Ended) return;
				if (gw.Paused) return;

				const mentions = winners.map(w => `<@${w}>`).join(', ');

				const newEmbed = new EmbedBuilder()
					.setTitle('`🛑` Giveaway Ended!')
					.setDescription(`This giveaway ended <t:${Math.floor(gw.EndTimestamp / 1000)}:R>`)
					.setColor('#FFFFFF')
					.addFields(
						{ name: '`👤` Entries', value: `\`${gw.Participants.length}\``, inline: true },
						{ name: '`🏆` Winners', value: `${mentions}`, inline: true }
					)

				const endMessage = await message.edit({ embeds: [newEmbed], components: [row] });

				endMessage.reply({ content: `Congratularions ${mentions}! You won the **${gw.Prize}** giveaway! [↗](https://discord.com/channels/${endMessage.guildId}/${endMessage.channelId}/${endMessage.id})` });

				gw.Ended = true;
				await giveaways.save().catch(err => console.log(err));
			}

		})
	} catch (err) {
		console.log(err);
	}
}

/**
 * @param {ButtonInteraction} interaction
 */
async function gwBtn(interaction) {
	if (!(interaction.customId === 'giveawayBtn')) return;

	const { message, user } = interaction;

	const gw = await gwSchema.findOne({ MessageId: message.id });
	if (!gw)
		return interaction.reply({ content: 'This giveaway does not exist!', ephemeral: true });

	if (gw.Participants.includes(user.id)) {
		gw.Participants = gw.Participants.filter((id) => id !== user.id);

		await gw.save().catch((err) => console.log(err));

		let embed = message.embeds[0];
		let fieldData = embed.data.fields[0].value;

		fieldData = `\`${parseInt(fieldData.replace("`", "")) - 1}\``;
		embed.data.fields[0].value = fieldData;

		message.edit({ embeds: [embed] }).catch((err) => console.log(err));

		return interaction.reply({ content: 'You have left the giveaway!', ephemeral: true });
	};

	gw.Participants.push(user.id);
	await gw.save().catch((err) => console.log(err));
	let embed = message.embeds[0];

	let fieldData = embed.data.fields[0].value;

	fieldData = `\`${parseInt(fieldData.replace("`", "")) + 1}\``;
	embed.data.fields[0].value = fieldData;

	message.edit({ embeds: [embed] }).catch((err) => console.log(err));

	return interaction.reply({ content: 'You have successfully entered the giveaway!', ephemeral: true });

}

module.exports = { checkGWs, shuffledArray, gwBtn, deleteExpiredGW };