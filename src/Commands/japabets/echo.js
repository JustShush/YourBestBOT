const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require("discord.js");
const { checkExistingWebHookInChannel } = require("../../functions/utils");

module.exports = {
	name: "echo",
	description: "Send",
	permission: "`SEND_MESSAGES`",
	usage: "`/japabets`",
	type: "Utility ⚙️",
	data: new SlashCommandBuilder()
		.setName("echo")
		.setDescription("Make YourBestBot say something.")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addStringOption((option) => option
			.setName("msg")
			.setRequired(true)
			.setDescription("The msg you want to say."))
		.setDMPermission(false)
		.setNSFW(false),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction, client) {

		const { options } = interaction;

		const msg = options.getString("msg").replace(/\\n/g, "\n").replace(/\\t/g, "\t").replace(/\\r/g, "");
		let webhook = await checkExistingWebHookInChannel(interaction);
		// If none found, create one
		if (!webhook) {
			webhook = await interaction.channel.createWebhook({
				name: 'Sra. Lin Po\'poh',
				avatar: "https://api.japabets.pt/img/avatars/linpopoh.png",
			}).catch(e => console.error(e))
		}
		await webhook.send({
			content: msg,
			//username: 'Webhook Bot',
			avatar: "https://api.japabets.pt/img/avatars/linpopoh.png",
		});

		interaction.reply({ content: msg , flags: MessageFlags.Ephemeral })
		//console.log(`${interaction.user.id} ${interaction.user.tag} has sent \`${msg}\` to ${interaction.channel.name}.`);
	}
}
