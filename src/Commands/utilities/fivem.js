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
		.setDescription('Gives your simple information related to a specific server.')
		.setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands)
		.addStringOption(o =>
			o.setName('server')
				.setDescription('The connect to the server. EX: cfx.re/join/bqjgz4')
				.setAutocomplete(true)
				.setRequired(true)),
	integration_types: [0, 1],
	contexts: [0, 1, 2],
	async autocomplete(interaction, client) {

		const focusedValue = interaction.options.getFocused();

		const choices = [{ name: "🔷 Diamond 🔷", value: "https://cfx.re/join/bqjgz4" }, { name: "AltF4", value: "https://cfx.re/join/zea3pd" },
		{ name: "Portugalia", value: "https://cfx.re/join/6z6el4" }, { name: "🔱 Atlantic 🔱", value: "https://cfx.re/join/8lla53" }];
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
		const op = ensureHttps(options.getString("server"))

		const pc = await getServerStatus(op);
		if (!pc) return await interaction.reply({ content: `Please check if code you provided is valid.`, ephemeral: true });

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

function ensureHttps(url) {
	if (!url.startsWith('https://')) return 'https://' + url;
	return url;
}
