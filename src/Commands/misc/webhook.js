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
		.addSubcommand(sub => sub
			.setName('report')
			.setDescription('Report to us a MALICIOUS webhook WITH PROOF of it.')
			.addStringOption(o => o
				.setName('webhook')
				.setDescription('The webhook url you want to report.')
				.setRequired(true)
			)
			.addStringOption(o => o
				.setName('links')
				.setDescription('Any useful links to proof the maliciousness of the webhook')
				.setRequired(true)
			)
			.addStringOption(o => o
				.setName('images')
				.setDescription('If you want to send images use imgbb.com and past them here')
				.setRequired(false)
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

		const member = interaction.member || interaction.user;
		const regex = /https?:\/\/(?:ptb\.|cannary\.)?(?:discord(?:app)?\.com)\/api\/webhooks\/\d+\/[\w-]+/;
		const URL = 'https://discord.com/api/webhooks/' + interaction.client.config.whSafetyComas;

		const newEmbed = new EmbedBuilder()
			.setTitle(`Your webhook whitelist request has been sent <3`)
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

		switch (cmd) {
			case 'whitelist':

				const url = interaction.options.getString('url');
				const repo = interaction.options.getString('repo');
				const reason = interaction.options.getString('reason');

				if (!regex.test(url))
					return interaction.reply({ content: `The webhook url should start with \`https://discord.com/api/webhooks/\``, flags: 'Ephemeral' });

				if (!(repo.startsWith('https://github.com/' || repo.startsWith('https://raw.githubusercontent.com/'))))
					return interaction.reply({ content: `The Repository url should start with \`https://github.com/\``, flags: 'Ephemeral' });

				const CONTENT = `\`\`\`json
{
	"memberName": "${member.user ? member.user.username : member.displayName}",
	"memberId": "${member.id},
	"html_url": "${repo}",
	"webhook": "${url}"
}\`\`\``

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

				newEmbed.setDescription(`Your webhook has been sent and is now under evaluation of its going to be whitelisted or not, to get feedback of the whitelisting please leave your dms open or join the support server discord.gg/3jRJCApUHw\n\nIf you want you can also add this discord bot to your server to protect in case some webhook is posted in any of the channels and that way you can also whitelist webhooks without having to join the support server \<3 Press the button to add the bot.`)

				await interaction.reply({ content: `Webhook sent.`, embeds: [newEmbed], components: [row], flags: 'Ephemeral' });

				break;

			case "report":

				const webhook = interaction.options.getString('webhook');
				const links = interaction.options.getString('links');
				const images = interaction.options.getString('images');

				if (!regex.test(webhook))
					return interaction.reply({ content: `The webhook url should start with \`https://discord.com/api/webhooks/\``, flags: 'Ephemeral' });

				if (images && !images.startsWith('https://ibb.co/'))
					return interaction.reply({ content: `The Images url should start with \`https://ibb.co/\` make sure your using \`https://imgbb.com\``, flags: 'Ephemeral' });

				await axios.post(URL, {
					content: '@everyone',
					embeds: [{
						title: "New Webhook to Report",
						description: `${member} | ${member.id} just reported a webhook.\n${links}${images ? "\n" + images : ""}`,
						footer: {
							text: "Automated Alert System",
							icon_url: "https://github.com/JustShush/WOWS/blob/main/imgs/whSafety.jpg?raw=true"
						},
						timestamp: new Date().toISOString()
					}]
				}).then((res) => console.log(res.data)).catch((err) => console.log(err));

				newEmbed.setDescription(`Your Webhook Report has been sent and it's now under evaluation, Thank you for reporting \<3\n To get FeedBack please leave your dms open of join the support server discord.gg/3jRJCApUHw \n\nIf you want you can also add this discord bot your server to protect it in case of someone webhook is posted in any of the channels.\n Press the button to add the bot. \<3`)

				await interaction.reply({ content: `Webhook Report Sent.`, embeds: [newEmbed], components: [row], flags: 'Ephemeral' });

				break;

			default:
				await interaction.reply({ content: `Something went wrong. Please use </send a-bug:1294318402424279072> to report this problem to the devs.`, flags: 'Ephemeral' });
				break;
		}
	}
}
