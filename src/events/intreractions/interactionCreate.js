const { ChatInputCommandInteraction } = require("discord.js");

module.exports = {
	name: "interactionCreate",
	/**
	 *  @param {ChatInputCommandInteraction} interaction
	 */
	execute(interaction, client) {
		if (!interaction.isChatInputCommand()) return;

		const command = client.commands.get(interaction.commandName);
		if (!command)
			return interaction.reply({
				content: "This command is outdated.",
				ephemeral: true
			});

		if (command.developer && interaction.user.id !== "453944662093332490") return interaction.reply({
			content: "This command is only available to the dev.",
			ephemeral: true
		});

		const validPermissions = [
			"CREATE_INSTANT_INVITE", //(create invitations to the guild)
			"KICK_MEMBERS",
			"BAN_MEMBERS",
			"ADMINISTRATOR",//(implicitly has *all* permissions, and bypasses all channel overwrites)
			"MANAGE_CHANNELS", //(edit and reorder channels)
			"MANAGE_GUILD", //(edit the guild information, region, etc.)
			"ADD_REACTIONS", //(add new reactions to messages)
			"VIEW_AUDIT_LOG",
			"PRIORITY_SPEAKER",
			"STREAM",
			"VIEW_CHANNEL",
			"SEND_MESSAGES",
			"SEND_TTS_MESSAGES",
			"MANAGE_MESSAGES", //(delete messages and reactions)
			"EMBED_LINKS", //(links posted will have a preview embedded)
			"ATTACH_FILES",
			"READ_MESSAGE_HISTORY", //(view messages that were posted prior to opening Discord)
			"MENTION_EVERYONE",
			"USE_EXTERNAL_EMOJIS", //(use emojis from different guilds)
			"VIEW_GUILD_INSIGHTS",
			"CONNECT", //(connect to a voice channel)
			"SPEAK", //(speak in a voice channel)
			"MUTE_MEMBERS", //(mute members across all voice channels)
			"DEAFEN_MEMBERS", //(deafen members across all voice channels)
			"MOVE_MEMBERS", //(move members between voice channels)
			"USE_VAD", //(use voice activity detection)
			"CHANGE_NICKNAME",
			"MANAGE_NICKNAMES", //(change other members' nicknames)
			"MANAGE_ROLES",
			"MANAGE_WEBHOOKS",
			"MANAGE_EMOJIS_AND_STICKERS",
			"USE_APPLICATION_COMMANDS",
			"REQUEST_TO_SPEAK",
			"MANAGE_EVENTS",
			"MANAGE_THREADS",
			"USE_PUBLIC_THREADS", //(deprecated)
			"CREATE_PUBLIC_THREADS",
			"USE_PRIVATE_THREADS", //(deprecated)
			"CREATE_PRIVATE_THREADS",
			"USE_EXTERNAL_STICKERS", //(use stickers from different guilds)
			"SEND_MESSAGES_IN_THREADS",
			"START_EMBEDDED_ACTIVITIES",
			"MODERATE_MEMBERS"
		];

		if (command.permissions.length) {
			let invalidPerms = []
			for (const perm of command.permissions) {
				if (!validPermissions.includes(perm)) {
					return console.log(`Invalid Permissions: ${perm}`.brightRed);
				}
				if (!interaction.member.permissions.has(perm)) {
					invalidPerms.push(perm);
					break;
				}
			}
			if (invalidPerms.length) {
				return interaction.reply({ content: `Missing Permissions: \`${invalidPerms}\`` });
			}
		}

		const subCommand = interaction.options.getSubcommand(false);
		if (subCommand) {
			const subCommandFile = client.subCommands.get(`${interaction.commandName}.${subCommand}`);
			if (!subCommandFile) return interaction.reply({
				content: "This command is outdated.",
				ephemeral: true
			});
			subCommandFile.execute(interaction, client);
		} else {
			try {
				command.execute(interaction, client);
				console.log(`\nGuild: ${interaction.guild.name}\nChannel: "${interaction.channel.name}"\nCommand: "${command.name}"\nUser: ${interaction.user.tag}`.brightGreen)
			} catch (err) {
				console.log(`\nGuild: ${interaction.guild.name}\nChannel: "${interaction.channel.name}"\nCommand: "${command.name}"\nUser: ${interaction.user.tag}`.brightRed)
			}
		}
	}
}