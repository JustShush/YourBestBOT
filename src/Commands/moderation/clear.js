const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const logdb = require("../../schemas/log");

module.exports = {
	name: "clear",
	description: "Clear x amount of messages.",
	permission: "`MANAGE_MESSAGES`, `MANAGE_CHANNELS`",
	usage: "`/clear [number]`, `/clear [number] [user]`",
	type: "Moderation",
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Clear messages.')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageChannels)
		.addStringOption((option) => option
			.setName("amount")
			.setDescription("The amount of messages to delete.(max 500)")
			.setRequired(true))
		.addUserOption((option) => option
			.setName('user')
			.setDescription('Clear messages of a specific user')
			.setRequired(false))
		.setDMPermission(false)
		.setNSFW(false),
	/**
	* @param {ChatInputCommandInteraction} interaction
	*/
	async execute(interaction, client) {
		try {

			const { options, guild } = interaction

			const n = options.getString("amount");
			const user = options.getUser('user');

			if (isNaN(n)) return interaction.reply({ content: 'Please provide a valid number between 1 and 100.', ephemeral: true });
			if (n < 1) return interaction.reply({ content: "You have to delete at least 1 message!", ephemeral: true });

			await interaction.deferReply({ ephemeral: true });

			deleteMessages(interaction.channel, parseInt(n), user);

			const logchannel = await logdb.findOne({ Guild: guild.id })
			if (logchannel) {
				const check = client.channels.cache.get(logchannel.Channel);
				if (check) {
					check.send({
						content: `${interaction.member} has cleared ${n} messages succesfully in <#${interaction.channel.id}>.`,
					})
				}
			}

			await interaction.followUp({ content: `You have deleted ${n} messages succesfully.`, ephemeral: true })
		} catch (error) {
			console.log(error)
		}
	}
}

async function deleteMessages(channel, totalToDelete, user) {
	let remaining = totalToDelete;
	if (user) {
		let messages;
		while (remaining > 0) {
			messages = await channel.messages.fetch()
				.then(messages => messages.filter(m => m.author.id === user.id))
				.then(messages => messages.first(parseInt(remaining)));
			const deleteCount = remaining > 100 ? 100 : remaining;
			// the true here forces the bot to delete msgs that older then 14 days.
			await channel.bulkDelete(messages, true);
			remaining -= deleteCount;
		}
		return;
	}
	while (remaining > 0) {
		const deleteCount = remaining > 100 ? 100 : remaining;
		// the true here forces the bot to delete msgs that older then 14 days.
		await channel.bulkDelete(deleteCount, true);
		remaining -= deleteCount;
	}
}
