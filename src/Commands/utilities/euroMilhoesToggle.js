const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const euroToggleSchema = require('../../schemas/euroMilhoesToggle');

module.exports = {
	name: "euromilhoes-toggle",
	description: "Create a new EuroMilhoes ticket",
	permission: "`SEND_MESSAGES`",
	usage: "`/euromilhoes-toggle`",
	subcommand: false,
	type: "Utility ⚙️",
	data: new SlashCommandBuilder()
		.setName('euromilhoes-toggle')
		.setDescription("Turn on or off.")
		.addStringOption(o => o
			.setName("option")
			.setDescription("Do you want to turn it off or on.")
			.setRequired(true)
			.addChoices(
				{ name: "On", value: "on" },
				{ name: "Off", value: "off" }
			)
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator, PermissionFlagsBits.UseApplicationCommands, PermissionFlagsBits.SendMessages)
		.setContexts(0) // 0 for guild | 1 for botDM | 2 everywhere
		.setIntegrationTypes(0) // 0 for guild install | 1 for user install
		.setNSFW(false),

	async execute(interaction) {

		let data = await euroToggleSchema.findOne();
		if (!data)
			data = await euroToggleSchema.create({
				status: true
			})

		const toggle_option = interaction.options.getString("option");
		if (toggle_option === "on") {
			if (data.status)
				return interaction.reply({ content: `The filter is already enabled.`, flags: MessageFlags.Ephemeral });
			else {
				(data.status = true), await data.save();
				await interaction.reply({ content: `The bad word filter is now enabled.`, flags: MessageFlags.Ephemeral });
			}
		} else if (toggle_option === "off") {
			if (data.status === false)
				return interaction.reply({
					content: `The filter is already disabled.`,
					flags: MessageFlags.Ephemeral
				});
			else {
				(data.status = false), await data.save();
				await interaction.reply({ content: `The bad word filter is now disabled.`, flags: MessageFlags.Ephemeral });
			}
		}
	}
};