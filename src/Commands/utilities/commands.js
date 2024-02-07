const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

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
		.setDMPermission(false)
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
			utilityArray = [];
			funArray = [];
			moderationArray = [];
			economyArray = [];
			otherArray = [];
			setupArray = [];
			
			client.commands.map(async (c) => {
				if (c.type === "Utility") {
					getSubcommand(interaction, utilityArray, c.name);
					//utilityArray.push(`\`${c.name}\``);
				} else if (c.type === "Fun") {
					getSubcommand(interaction, funArray, c.name);
					//funArray.push(`\`${c.name}\``);
				} else if (c.type === "Moderation") {
					getSubcommand(interaction, moderationArray, c.name);
					//moderationArray.push(`\`${c.name}\``);
				} else if (c.type === "Economy") {
					getSubcommand(interaction, economyArray, c.name);
					//economyArray.push(`\`${c.name}\``);
				} else if (c.type === "Other") {
					getSubcommand(interaction, otherArray, c.name);
					//otherArray.push(`\`${c.name}\``);
				} else if (c.type === "Setup") {
					getSubcommand(interaction, setupArray, c.name);
					//setupArray.push(`\`${c.name}\``);
				}
			});

			const newEmbed = new EmbedBuilder()
				.setDescription(
					`**Welcome to the help command. You can view more information on the commands with /commands [command].**
	Utility Commands:
	${utilityArray.join(' ')}
	Fun Commands:
	${funArray.join(' ')}
	Moderation Commands:
	${moderationArray.join(' ')}
	Economy Commands:
	${economyArray.join(' ')}
	Setup Commands:
	${setupArray.join(' ')}
	Other Commands:
	${otherArray.join(' ')}
	`
				)
				//.setColor("DARK_NAVY")
				.setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: member.user.displayAvatarURL() })
				.setTimestamp()

			await interaction.reply({ content: " ", embeds: [newEmbed] });
		} else {
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
