const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");

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
			.setRequired(false)),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction, client) {

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
					utilityArray.push(`\`${c.name}\``);
				} else if (c.type === "Fun") {
					funArray.push(`\`${c.name}\``);
				} else if (c.type === "Moderation") {
					moderationArray.push(`\`${c.name}\``);
				} else if (c.type === "Economy") {
					economyArray.push(`\`${c.name}\``);
				} else if (c.type === "Other") {
					otherArray.push(`\`${c.name}\``);
				} else if (c.type === "Setup") {
					setupArray.push(`\`${c.name}\``);
				}
			});

			const newEmbed = new EmbedBuilder()
				.setDescription(
					`**Welcome to the help command. You can view more information on the commands with /commands [command].**
	Utility Commands:
	${utilityArray.toString().replaceAll(",", ", ")}
	Fun Commands:
	${funArray.toString().replaceAll(",", ", ")}
	Moderation Commands:
	${moderationArray.toString().replaceAll(",", ", ")}
	Economy Commands:
	${economyArray.toString().replaceAll(",", ", ")}
	Setup Commands:
	${setupArray.toString().replaceAll(",", ", ")}
	Other Commands:
	${otherArray.toString().replaceAll(",", ", ")}
	`
				)
				//.setColor("DARK_NAVY")
				.setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: member.user.displayAvatarURL() })
				.setTimestamp()

			interaction.reply({ embeds: [newEmbed] });
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

				interaction.reply({ embeds: [cmdEmbed], ephemeral: true });
			}
		}
	}
}
