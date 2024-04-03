const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { getServerStatus } = require('../../functions/fivem');

module.exports = {
	name: "fivem",
	description: "Get the number of players from the cfx server website",
	type: "Utility",
	subcommand: false,
	permissions: "UseApplicationCommands",
	data: new SlashCommandBuilder()
		.setName('fivem')
		.setDescription('Makes the bot say something in the specified channel')
		.setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands)
		.addStringOption(o =>
			o.setName('server')
				.setDescription('O link do servidor. ex: https://cfx.re/join/code')
				.setAutocomplete(true)
				.setRequired(true)),
	integration_types: [0, 1],
	contexts: [0, 1, 2],
	async autocomplete(interaction, client) {

		const focusedValue = interaction.options.getFocused();

		const choices = [{ name: "🔷 Diamond 🔷", value: "https://cfx.re/join/bqjgz4" }, { name: "Portugalia", value: "https://cfx.re/join/6z6el4" },
		{ name: "Utopia", value: "https://cfx.re/join/vyxrqx" }, { name: "DarkLife", value: "https://cfx.re/join/758kzd" },
		{ name: "🔱 Atlantic 🔱", value: "https://cfx.re/join/8lla53" }];
		const fvalue = { name: focusedValue, value: focusedValue }
		let list = choices;
		if (focusedValue) list = [fvalue, ...choices];

		//console.log("list: ", list);
		//console.log(focusedValue);
		void interaction.respond(
			list.slice(0, 25)
		);
	},
	async execute(interaction) {
		const { options } = interaction;
		const op = options.getString("server");

		if (op === "chorao") {
			const pc = await getServerStatus("https://cfx.re/join/godogx");
			return interaction.reply({ content: `[${pc.playercount}/500] on Chorão RP | Season 2`, ephemeral: true });
		} else {
			const pc = await getServerStatus(op);

			const newEmbed = new EmbedBuilder()
				.setAuthor({ name: pc.name, iconURL: pc.logo })
				.setTitle(`**${pc.playercount}** players online.`)
				.setTimestamp()

			const row = new ActionRowBuilder().setComponents(
				new ButtonBuilder()
					.setEmoji("🚀")
					.setLabel("Connect")
					.setURL(op)
					.setStyle(ButtonStyle.Link),
			)

			return interaction.reply({ embeds: [newEmbed], components: [row], ephemeral: true });
		}
	}
}
