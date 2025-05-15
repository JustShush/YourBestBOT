const axios = require('axios');
const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

// later make it sub command where people choose BTC or USD etc
// for BTC make it use addNumberOption so that people can choose 0.0002BTC instead of an entire 1 BTC, here i can also use .setMinValue(0.000022)
// the USD continue with addIntegerOption just to make it easier
module.exports = {
	name: "donate",
	description: "Thank you for supporting the project <3",
	permission: "`SEND_MESSAGES`, `USE_APPLICATION_COMMANDS`",
	usage: "`/donate [amount]`",
	type: "Misc",
	data: new SlashCommandBuilder()
		.setName("donate")
		.setDescription("Thank you for supporting the project <3")
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages, PermissionFlagsBits.UseApplicationCommands)
		.addIntegerOption((option) => option
			.setName("amount")
			.setRequired(true)
			.setDescription(`The amount you want to donate (Minimum 2$)`)
			.setMinValue(2)
		)
		.setNSFW(false),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction, client) {

		const { options } = interaction;

		const amount = options.getInteger("amount");

		try {
			const res = await axios.post('https://api.yourbestbot.pt/create-donation', {
				discordId: interaction.user.id,
				amount: amount,
				type: 'USD'
			});
			console.log(`${interaction.user.username}|${interaction.user.id} from ${interaction.guild.name} tried to run the donation command ${res.data.hosted_url}`);
			interaction.reply({ content: `all good ${res.data.hosted_url}, you have 1hour to complete this donation \<3`});
		} catch (e) {
			console.error(e);
		}
	}
}
