const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const axios = require('axios');

module.exports = {
	name: "webhook",
	description: "Webhook related commands.",
	permission: "`SEND_MESSAGES`",
	subcommand: true,
	type: "Misc",
	data: new SlashCommandBuilder()
		.setName("webhook")
		.setDescription("Webhook related commands.")
		.addSubcommand(sub => sub
			.setName('whitelist')
			.setDescription('Whitelist a webhook.')
			.addStringOption(o => o
				.setName('url')
				.setDescription('The url of the webhook to whitelist.')
				.setRequired(true)
			)
			.addStringOption(o => o
				.setName('repo')
				.setDescription('The repository url where the webhook is being used.')
				.setRequired(true)
			)
			.addStringOption(o => o
				.setName('reason')
				.setDescription('The reason that you want to whitelist this webhook. Not providing one may not be whitelisted.')
				.setMaxLength(512)
				.setRequired(true)
			)
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands, PermissionFlagsBits.SendMessages)
		.setContexts(0, 1, 2) // 0 for guild | 1 for botDM | 2 everywhere
		.setIntegrationTypes(0, 1) // 0 for guild install | 1 for user install
		.setNSFW(false),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction) {

		const cmd = interaction.options.getSubcommand();

		switch (cmd) {
			case 'whitelist':

				const url = interaction.options.getString('url');
				const repo = interaction.options.getString('repo');
				const reason = interaction.options.getString('reason');
				const member = interaction.member || interaction.user;

				if (!url.startsWith('https://discord.com/api/webhooks/'))
					return interaction.reply({ content: `The webhook url should start with \`https://discord.com/api/webhooks/\``, flags: 'Ephemeral' });

				if (!(repo.startsWith('https://github.com/' || repo.startsWith('https://raw.githubusercontent.com/'))))
					return interaction.reply({ content: `The webhook url should start with \`https://github.com/\``, flags: 'Ephemeral' });

				const CONTENT = `\`\`\`json
{
	"memberName": "${member.user ? member.user.username : member.displayName}",
	"memberId": "${member.id},
	"html_url": "${repo}",
	"webhook": "${url}"
}\`\`\``

				const URL = 'https://discord.com/api/webhooks/' + interaction.client.config.whSafetyComas;
				await axios.post(URL, {
					content: '@everyone\n' + CONTENT,
					embeds: [{
						title: "New Webhook to whitelist",
						description: `${member} | ${member.id} wants to whitelist a webhook.\nThe webhook is being used here: ${repo}\nReason: ${reason}`,
						footer: {
							text: "Automated Alert System",
							icon_url: "https://github.com/JustShush/WOWS/blob/main/imgs/whSafety.jpg?raw=true"
						},
						timestamp: new Date().toISOString()
					}]
				}).then((res) => console.log(res.data)).catch((err) => console.log(err));

				const newEmbed = new EmbedBuilder()
					.setTitle(`Your webhook whitelist request has been sent <3`)
					.setDescription(`Your webhook has been sent and is now under evaluation of its going to be whitelisted or not, to get feedback of the whitelisting please leave your dms open or join the support server discord.gg/3jRJCApUHw\n\nIf you want you can also add this discord bot to your server to protect in case some webhook is posted in any of the channels and that way you can also whitelist webhooks without having to join the support server \<3 Press the button to add the bot.`)
					.setColor('Green')

				const row = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setLabel('🤖 Invite me! <3')
						.setURL(`https://yourbestbot.pt/invite`)
						.setStyle(ButtonStyle.Link),
					new ButtonBuilder()
						.setLabel('🔗 Support Server')
						.setURL(`https://discord.gg/3jRJCApUHw`)
						.setStyle(ButtonStyle.Link)
				);

				await interaction.reply({ content: `Webhook sent.`, embeds: [newEmbed], components: [row], flags: 'Ephemeral' });

				break;

			default:
				await interaction.reply({ content: `Something went wrong. Please use </send a-bug:1294318402424279072> to report this problem to the devs.`, flags: 'Ephemeral' });
				break;
		}
	}
}
