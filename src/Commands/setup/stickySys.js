const { SlashCommandBuilder, PermissionsBitField, PermissionFlagsBits, ChannelType } = require('discord.js');
const sticky = require("../../schemas/stickySys.js");

module.exports = {
	name: "sticky",
	description: "Manage this server sticky messages.",
	type: "Setup 🔨",
	subcommand: true,
	permission: "ManageChannels",
	data: new SlashCommandBuilder()
		.setName('sticky')
		.setDescription('Manage this server sticky messages.')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
		.addSubcommand(subcommand =>
			subcommand
				.setName('add')
				.setDescription('Add a sticky msg from to channel.')
				.addStringOption(o => o.setName("msg").setDescription("The msg here.").setRequired(true))
				.addChannelOption(o => o.setName("channel").setDescription("Channel ID here.").setRequired(true).addChannelTypes(ChannelType.GuildText))
				.addStringOption(o => o.setName("msg_id").setDescription("bot\'s msg ID here.").setRequired(true)),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('remove')
				.setDescription("Remove a sticky msg from a channel.")
				.addChannelOption(o => o.setName("channel").setDescription("channel here").setRequired(true).addChannelTypes(ChannelType.GuildText)),
		)
		.setContexts(0) // 0 for guild | 1 for botDM | 2 everywhere
		.setIntegrationTypes(0) // 0 for guild install | 1 for user install
		.setNSFW(false),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction) {

		if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: `You don't have the permissions to create an announcement!`, ephemeral: true });

		const { options } = interaction;
		const cmd = options.getSubcommand();

		let channel = null;
		let data = null;
		let i = -1;

		switch (cmd) {
			case "add":
				channel = options.getChannel("channel");
				
				data = await sticky.findOne({
					GuildId: interaction.guild.id
				});
				if (!data) {
					data = await sticky.create({
						GuildName: interaction.guild.name,
						GuildId: interaction.guild.id,
						User: interaction.user.id,
						UserTag: interaction.user.tag,
						stickys: []
					})
				}
				i = data.stickys.findIndex((e) => e.ChannelID == channel.id);
				if (i != -1)
				return interaction.reply({ content: `There's already a sticky msg in that channel. ${channel}`, ephemeral: true });
				
				if (data.Current >= data.Max) return interaction.reply({ content: `You have reached the maximum of sticky messages.\nMaximum is set to: ${data.Max}`, ephemeral: true });

				const Msg = options.getString("msg");
				const MsgID = options.getString("msg_id");

				if (isNaN(MsgID))
					return interaction.reply({ content: `Invalid message ID. Please enter a valid number.`, ephemeral: true });

				const obj = {
					ChannelID: channel.id,
					MSG: Msg,
					MSGID: MsgID,
				}

				data.Current = data.Current + 1;
				data.stickys.push(obj);
				await data.save()

				interaction.reply({ content: `done!\nChannelID: ${channel.id} | <#${channel.id}>\nSticky MSG: ${Msg}`, ephemeral: true });

				break;

			case "remove":
				channel = options.getChannel("channel");

				data = await sticky.findOne({
					GuildId: interaction.guild.id
				});

				if (!data) return interaction.reply({ content: `❌ This server doesnt have any Sticky messages setup, consider using /sticky add to create a new sticky message.`, ephemeral: true });

				i = data.stickys.findIndex((e) => e.ChannelID == channel.id);
				if (i == -1) return interaction.reply({ content: `❌ This channel ${channel} didn't had any sticky message.`, ephemeral: true });

				data.Current = data.Current - 1;
				data.stickys.splice(i, 1);
				await data.save();

				await interaction.reply({ content: `✅ Sticky message Removed successfully.`, ephemeral: true });

				break;
			default:
				// theres no need for default but ya its here ig
				break;
		}

	}
}