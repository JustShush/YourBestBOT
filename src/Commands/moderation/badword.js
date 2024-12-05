const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const filterSchema = require("../../schemas/filter.js");

module.exports = {
	name: "badword",
	description: "Block custom words from being used.",
	permission: "`ADMINISTRATOR`",
	subcommand: true,
	type: "Moderation 🛠️",
	data: new SlashCommandBuilder()
		.setName("badword")
		.setDescription("Block custom words from being used.")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addSubcommand(o => o
			.setName("toggle")
			.setDescription("Turn the filter on or off.")
			.addStringOption(o => o
				.setName("option")
				.setDescription("Do you want to turn it off or on.")
				.setRequired(true)
				.addChoices(
					{ name: "On", value: "on" },
					{ name: "Off", value: "off" }
				)
			)
		)
		.addSubcommand(o => o
			.setName("add")
			.setDescription("Add a word to the filter.")
			.addStringOption(o => o
				.setName("word")
				.setDescription("This will match the word regardless of case usage.")
				.setRequired(true)
			)
		)
		.addSubcommand(o => o
			.setName("delete")
			.setDescription("Remove a word from the filter.")
			.addStringOption(o => o
				.setName("word")
				.setDescription("This will match the word regardless of case usage.")
				.setRequired(true)
			)
		)
		.addSubcommand(o => o
			.setName("view")
			.setDescription("View the filtered words. (sent to DMs)")
		)
		.addSubcommand(o => o
			.setName("immunity")
			.setDescription("Give or take immunity to/from a member.")
			.addStringOption(o => o
				.setName("action")
				.setDescription("Give or take immunity?")
				.setRequired(true)
				.addChoices(
					{ name: "Add", value: "add" },
					{ name: "Remove", value: "remove" }
				)
			)
			.addUserOption(o => o
				.setName("user")
				.setDescription("Which user is this for?")
				.setRequired(true)
			)
		)
		.setNSFW(false),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction) {

		const { options, guildId } = interaction;

		let data = await filterSchema.findOne({ GuildId: guildId });
		if (!data) {
			await filterSchema.create({
				GuildId: guildId,
				toggle: false,
				words: [],
				immune: [],
			});
		}

		const subcommand = options.getSubcommand();
		const word = options.getString("word");

		switch (subcommand) {
			case "toggle":
				if (!data)
					data = await filterSchema.create({
						guildId,
						toggle: false,
						words: [],
						immune: [],
					});

				const toggle_option = options.getString("option");

				if (toggle_option === "on") {
					if (data.toggle)
						return interaction.reply({ content: `The filter is already enabled.`, ephemeral: true, });
					else {
						(data.toggle = true), await data.save();
						await interaction.reply({ content: `The bad word filter is now enabled.`, ephemeral: true });
					}
				} else if (toggle_option === "off") {
					if (data.toggle === false)
						return interaction.reply({
							content: `The filter is already disabled.`,
							ephemeral: true,
						});
					else {
						(data.toggle = false), await data.save();
						await interaction.reply({ content: `The bad word filter is now disabled.`, ephemeral: true });
					}
				}
				break;
			case "add":
				const wordsArr = data.words;

				if (wordsArr.includes(word))
					return interaction.reply({
						content: `The word you attempted to add is already in the filter.`,
					});
				else {
					data.words.push(word);
					await data.save();
					await interaction.reply({
						content: `I have added ||${word}|| to the filter. This will be deleted and the user will be warned on attempt to use it.`,
						ephemeral: true
					});
				}
				break;
			case "delete":
				if (!data.words.includes(word))
					return interaction.reply({
						content: `This word isn't in the filter.`,
					});
				else {
					const updatedArr = data.words.filter((words) => words !== word);
					data.words = updatedArr;
					await data.save();

					await interaction.reply({ content: `I have deleted ||${word}|| from the filter.`, ephemeral: true });
				}
				break;
			case "view":
				if (!data) return interaction.reply({ content: `You have no words in the blacklist filter.`, ephemeral: true });
				if (!data.words) return interaction.reply({ content: `You have no words in the blacklist filter.`, ephemeral: true });
				if (data.words.length === 0)
					return interaction.reply({
						content: `You have no words in the blacklist filter.`,
						ephemeral: true
					});

				const wordMap = data.words.map((word) => {
					return `${word}`;
				});
				const formatMap = wordMap.join(", ");

				const immuneMembers = await Promise.all(
					data.immune.map(async (userId) => {
						try {
							const getFromGuild = await interaction.client.users.fetch(userId);
							return `${client.emoji.tab} ${client.emoji.long} ${getFromGuild.displayName}`;
						} catch (error) {
							console.log(error);
						}
					})
				)

				const formatArray = immuneMembers.join("\n");

				const embed = new EmbedBuilder()
					.setAuthor({
						name: `${interaction.guild.name} Moderation`,
						iconURL: interaction.guild.iconURL(),
					})
					.setThumbnail(interaction.guild.iconURL())
					.setDescription(
						`Here is the current configuration for the word blacklist filter:\n\nEnabled: ${data.toggle ? "true" : "false"
						}\nCurrent words: ${formatMap}\nImmune members:\n${formatArray}`
					)
					.setTimestamp();

				await interaction.reply({
					embeds: [embed],
					ephemeral: true
				});
				break;
			case "immunity":
				const action = options.getString("action");
				const userToAction = options.getUser('user');

				if (!data) return await interaction.reply({ content: `You need to setup the filter first.`, ephemeral: true });

				if (action === "add") {
					if (data.immune.includes(userToAction.id))
						return await interaction.reply({
							content: `This user is already immune from the filter.`, ephemeral: true
						})

					data.immune.push(userToAction.id);
					await data.save();
					await interaction.reply({ content: ` ${userToAction.displayName} is now immune from the word filter.`, ephemeral: true });
				} else if (action === "remove") {
					if (!data.immune.includes(userToAction.id))
						return await interaction.reply({
							content: `This user is not immune from the filter`, ephemeral: true
						})

					let newArray = data.immune.filter(userId => userId !== userToAction.id);
					data.immune = newArray;
					await data.save();

					await interaction.reply({
						content: ` ${userToAction.displayName} has had their immunity removed.`, ephemeral: true
					})
				}
		}
	}
}
