const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { commandsArr } = require("../../Events/messageCreate.js");

module.exports = {
	name: "commands",
	description: "Shows the list of commands and how to use them.",
	permission: "SEND_MESSAGES",
	usage: "`/commands, /commands [command]`",
	type: "Other",
	data: new SlashCommandBuilder()
		.setName("commands")
		.setDescription("Show all the commands available.")
		.addStringOption((option) => option
			.setName("command")
			.setDescription("View information on a certain command.")
			.setRequired(false))
		.setContexts(0, 1, 2) // 0 for guild | 1 for botDM | 2 everywhere
		.setIntegrationTypes(0, 1) // 0 for guild install | 1 for user install
		.setNSFW(false),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction, client) {

		// technically, this can be moved into the ready event
		if (!interaction.client.application.commands.cache.size)
			await interaction.client.application.commands.fetch();

		// random colors from one dark color palette
		const colors = ['#282C34', '#E06C75', '#98C379', '#E5C07b', '#61AFEF', '#C678DD', '#56B6C2', '#ABB2BF', '#6B859E', '#3890E9', '#A359ED', '#EC5252', '#C97016', '#5DA713', '#13AFAF'];
		const color = Math.floor(Math.random() * colors.length);
		const resColor = colors[color];
		// end of the color randomization

		const { member, options } = interaction

		const cmd = options.getString("command");

		// Get all global slash command IDs
		//const globalCommands = await client.application?.commands.fetch();
		//const globalCommandIds = globalCommands?.map(command => command.id);
		//console.log('Global command IDs:', globalCommandIds);

		if (!cmd) {
			await interaction.deferReply();

			// Legacy commands
			const legacyArr = commandsArr.map(cmd => '+' + cmd);

			utilityArray = [];
			funArray = [];
			moderationArray = [];
			economyArray = [];
			otherArray = [];
			setupArray = [];
			votersArray = [];
			gwArray = [];
			miscArray = [];

			client.commands.map(async (c) => {
				if (c.type === "Utility ⚙️") {
					getSubcommand(interaction, utilityArray, c.name);
					//utilityArray.push(`\`${c.name}\``);
				} else if (c.type === "Fun 🤪") {
					getSubcommand(interaction, funArray, c.name);
				} else if (c.type === "Moderation 🛠️") {
					getSubcommand(interaction, moderationArray, c.name);
				} else if (c.type === "Economy 💸") {
					getSubcommand(interaction, economyArray, c.name);
				} else if (c.type === "Other") {
					getSubcommand(interaction, otherArray, c.name);
				} else if (c.type === "Setup 🔨") {
					getSubcommand(interaction, setupArray, c.name);
				} else if (c.type === "Voter ❤️") {
					getSubcommand(interaction, votersArray, c.name);
				} else if (c.type === "Giveaway 🎉") {
					getSubcommand(interaction, gwArray, c.name);
				} else if (c.type === "Misc") {
					getSubcommand(interaction, miscArray, c.name);
				}
			});

			const newEmbed = new EmbedBuilder()
				.setDescription(
					`**Welcome to the help command. You can view more information on the commands with /commands [command].**
	Utility ⚙️ Commands:
	${utilityArray.join(' ')}
	Fun 🤪 Commands:
	${funArray.join(' ')}
	Moderation 🛠️ Commands:
	${moderationArray.join(' ')}
	Economy 💸 Commands:
	${economyArray.join(' ')}
	Setup 🔨 Commands:
	${setupArray.join(' ')}
	Giveaway 🎉 Commands:
	${gwArray.join(' ')}
	Misc Commands:
	${miscArray.join(' ')}
	Other Commands:
	${otherArray.join(' ')}

	> **Voters exclusive Commands:**\n-# To get access to this commands run </vote:1294067743296847944> for more info \<3
	${votersArray.join(' ')}

	*Legacy(+prefix) commands*
	${legacyArr.join(", ")}
	`
				)
				//.setColor("DARK_NAVY")
				.setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: member.user.displayAvatarURL() })
				.setTimestamp()

			await interaction.editReply({ content: " ", embeds: [newEmbed] });
		} else {
			if (commandsArr.includes(cmd)) return interaction.reply({ content: `At this moment legacy commands dont have a detailed description. sorry \<3`, ephemeral: true });
			embedMessage = false;
			client.commands.map(async (c) => {
				if (c.name === cmd) {
					embedMessage = `
Information on the command \`${cmd}\`:
Name: **${c.name}**
Type: ${c.type}
Description: \`${c.description}\`
Usage: ${c.usage}
Permissions: ${c.permission}
`;
				}
			});
			if (!embedMessage) {
				return interaction.reply({ content: `There is no command with the name \`${cmd}\`.`, ephemeral: true });
			} else {
				const cmdEmbed = new EmbedBuilder()
					.setDescription(`${embedMessage.toString()}`)
					//.setColor("DARK_NAVY")
					.setFooter({ text: `Requested by ${interaction.user.tag}` })
					.setTimestamp()

				await interaction.reply({ content: " ", embeds: [cmdEmbed], ephemeral: true });
			}
		}
	}
}

// this function gets the slash command, now i only need to make it get if the command has sub commands
// TY Luna https://discord.com/channels/1055188344188973066/1096722788385050694/1199455671016509480
function getSlashCommand(client, name, subcommand) {
	const command = client.application.commands.cache.find(((cmd) => cmd.name === name));
	if (!command) return `\`${name}${subcommand ? ` ${subcommand}` : ""}\``;

	return `</${command.name}${subcommand ? ` ${subcommand}` : ""}:${command.id}>`
}

function getSubcommand(interaction, list, name) {
	for (const [, command] of interaction.client.application.commands.cache) {
		if (command.name !== name) continue;

		const subcommands = (command?.options || []).filter(option => option.type === ApplicationCommandOptionType.Subcommand) || [];

		if (subcommands.length) {
			for (const subcommand of subcommands) {
				list.push(`${getSlashCommand(interaction.client, command.name, subcommand.name)}`);
			}
			continue;
		}
		list.push(getSlashCommand(interaction.client, command.name));
	}
	return list;
}
