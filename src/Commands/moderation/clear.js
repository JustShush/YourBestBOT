const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const logdb = require("../../schemas/log");

module.exports = {
	name: "clear",
	description: "Clear x amount of messages.",
	permission: "`MANAGE_MESSAGES`, `MANAGE_CHANNELS`",
	usage: "`/clear [number]`",
	type: "Moderation",
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Clear messages.')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageChannels)
		.addStringOption((option) => option
			.setName("amount")
			.setDescription("The amount of messages to delete.(max 100)")
			.setRequired(true))
		.setDMPermission(false)
		.setNSFW(false),
	/**
	* @param {ChatInputCommandInteraction} interaction
	*/
	async execute(interaction, client) {
		try {

			const { options, guild } = interaction

			const n = options.getString("amount");

			if (isNaN(n)) return interaction.reply({ content: 'Please provide a valid number between 1 and 100.', ephemeral: true });
			if (n < 1) return interaction.reply({ content: "You have to delete at least 1 message!", ephemeral: true });
			
			await interaction.deferReply({ ephemeral: true });

			deleteMessages(interaction.channel, parseInt(n));

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

async function deleteMessages(channel, totalToDelete) {
	let remaining = totalToDelete;
	while (remaining > 0) {
		const deleteCount = remaining > 100 ? 100 : remaining;
		// the true here forces the bot to delete msgs that older then 14 days.
		await channel.bulkDelete(deleteCount, true);
		remaining -= deleteCount;
	}
}
