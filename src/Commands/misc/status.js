const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const cpuStat = require("cpu-stat");
const os = require("os");

module.exports = {
	name: "status",
	description: "Show bot's status",
	permission: "`SEND_MESSAGES`",
	usage: "`/status`",
	type: "Misc",
	data: new SlashCommandBuilder()
		.setName("status")
		.setDescription("Show bot's status")
		.setContexts(0, 1, 2) // 0 for guild | 1 for botDM | 2 everywhere
		.setIntegrationTypes(0, 1) // 0 for guild install | 1 for user install
		.setNSFW(false),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	execute(interaction, client) {

		const days = Math.floor(client.uptime / 86400000)
		const hours = Math.floor(client.uptime / 3600000) % 24
		const minutes = Math.floor(client.uptime / 60000) % 60
		const seconds = Math.floor(client.uptime / 1000) % 60

		let time = 0;
		if (days == 0) {
			if (hours == 0) {
				time = `${minutes} minutes and ${seconds} seconds`;
			} else time = `${hours} h ${minutes} min ${seconds} sec`;
		} else time = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;

		cpuStat.usagePercent(function (error, percent) {

			if (error) return interaction.reply({ content: `${error}` })

			const memoryUsage = formatBytes(process.memoryUsage().heapUsed)
			const node = process.version
			const cpu = percent.toFixed(2)

			const embed = new EmbedBuilder()
				.setTitle("Bot Information")
				.setDescription(`❒ Total Guilds: ${client.guilds.cache.size}\n❒ Total users: ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)}\n❒ Websocket Ping: ${client.ws.ping} ms`)
				.setColor("Green")
				.setThumbnail(client.user.displayAvatarURL({ format: 'png', dynamic: true }))
				.addFields(
					{
						name: `**CPU**:`,
						value: `❯ **OS**: ${os.platform()} [${os.arch()}]\n❯ **CORES**: ${os.cpus().length}\n❯ **Usage**:  ${cpu} %`,
						inline: true
					},
					{
						name: "**RAM**:",
						value: `❯ **Used**: ${formatBytes(os.totalmem() - os.freemem())}\n❯ **Available**: ${formatBytes(os.freemem())}\n❯ **Usage**: ${memoryUsage}`,
						inline: true
					},
					{ name: '\u200B', value: '\u200B', inline: true },
					{ name: "Help Command:", value: `</help:1222174029813776519>`, inline: true },
					{ name: "**Node Js version:**", value: `${node}`, inline: true },
					{ name: "Developer:", value: `<@453944662093332490>`, inline: true },
					{ name: "**Uptime:**", value: `\`\`\`${time}\`\`\``, inline: false },
				)

			const row = new ActionRowBuilder().setComponents(
				new ButtonBuilder()
					.setLabel("Add YourBestBOT")
					.setEmoji("🔗")
					.setURL("https://yourbestbot.pt/invite")
					.setStyle(ButtonStyle.Link),
				new ButtonBuilder()
					.setLabel("Support Server")
					.setEmoji("<:discord:1201226391987957901>")
					.setURL("https://yourbestbot.pt/support")
					.setStyle(ButtonStyle.Link),
				new ButtonBuilder()
					.setLabel("YourBestBOT Website")
					.setEmoji("🌐")
					.setURL("https://yourbestbot.pt/")
					.setStyle(ButtonStyle.Link))

			interaction.reply({ embeds: [embed], components: [row] })
		})

		function formatBytes(a, b) {
			let c = 1024
			d = b || 2
			e = ['B', 'KB', 'MB', 'GB', 'TB']
			f = Math.floor(Math.log(a) / Math.log(c))

			return parseFloat((a / Math.pow(c, f)).toFixed(d)) + '' + e[f]
		}
	}
}