const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const logdb = require("../../schemas/log");

module.exports = {
	name: "clear",
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Clear messages.')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageChannels)
		.addNumberOption((option) => option
			.setName("amount")
			.setDescription("The amount of messages to delete.(max 100)")
			.setRequired(true)),
	/**
	* @param {ChatInputCommandInteraction} interaction
	*/
	async execute(interaction, client) {
		try {

			const { options, guild } = interaction

			const n = options.getNumber("amount");
			if (n >= 100) return interaction.reply({ content: "You can't remove more than 100 mesages!" });
			if (n < 1) return interaction.reply({ content: "You have to delete at least 1 message!" });

			interaction.channel.messages.fetch({
				limit: n
			}).then(msg => {
				interaction.channel.bulkDelete(msg)
			})

			const logchannel = await logdb.findOne({ Guild: guild.id })
			if (logchannel) {
				const check = client.channels.cache.get(logchannel.Channel);
				if (check) {
					check.send({
						content: `${interaction.member} has cleared ${n} messages succesfully in <#${interaction.channel.id}>.`,
					})
				}
			}

			await interaction.reply({ content: `You have deleted ${n} messages succesfully.`, ephemeral: true })
		} catch (error) {
			console.log(error)
		}
	}
}