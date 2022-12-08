const { EmbedBuilder, SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');
const EconomyChecker = require("../../schemas/economy_checker");

module.exports = {
	name: "balance",
	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription('See your balance.')
		.addUserOption((option) => option
			.setName("member")
			.setDescription("The member you want to see is balance.")),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction, client) {
		try {

			// random colors from one dark color palette 
			const colors = ['#282C34', '#E06C75', '#98C379', '#E5C07b', '#61AFEF', '#C678DD', '#56B6C2', '#ABB2BF', '#6B859E', '#3890E9', '#A359ED', '#EC5252', '#C97016', '#5DA713', '#13AFAF'];
			const color = Math.floor(Math.random() * colors.length);
			const resColor = colors[color];
			// end of the color randomization

			const { options } = interaction;

			const target = options.getUser("member");

			const userData = await EconomyChecker.findOne({
				Guild: interaction.guild.id,
				User: interaction.user.id,
			});
			if (!userData) {
				await EconomyChecker.create({
					GuildName: interaction.guild.name,
					Guild: interaction.guild.id,
					User: interaction.user.id,
					UserTag: interaction.user.tag,
					balance: 0,
					ask_cooldown: 0
				});
			}

			if (target !== null) {
				const targetdb = await EconomyChecker.findOne({
					Guild: interaction.guild.id,
					User: interaction.user.id
				});
				if (!targetdb) {
					await EconomyChecker.create({
						GuildName: interaction.guild.name,
						Guild: interaction.guild.id,
						User: interaction.user.id,
						UserTag: interaction.user.tag,
						balance: 0,
						ask_cooldown: 0
					});
				}

				const embedTarget = new EmbedBuilder()
					.setAuthor({
						name: `${interaction.member.user.tag}`,
						iconURL: `${interaction.member.user.avatarURL()}`,
					})
					.setColor(resColor)
					.setDescription(`${target} currently has **${targetdb.balance}** coins!\nWhy do you want to know this tho...`)
					.setTimestamp()

				if (targetdb.balance === 0) {
					embedTarget.setFooter({ text: `Imagine having no coins, what a loser.` });
				} else if (targetdb.balance < 10000) {
					embedTarget.setFooter({ text: `Not enough coins, work more!` });
				} else if (targetdb.balance < 50000) {
					embedTarget.setFooter({ text: `Sounds like a good amount to me. Dont get robbed!` });
				} else {
					embedTarget.setFooter({ text: `Alright, you're the Elon of Musks with that amount of coins...` });
				}

				interaction.reply({
					embeds: [embedTarget],
				});
				return;

			}

			const embed = new EmbedBuilder()
				.setAuthor({
					name: `${interaction.member.user.tag}`,
					iconURL: `${interaction.member.user.avatarURL()}`,
				})
				.setColor(resColor)
				.setDescription(`You currently have **${userData.balance}** coins!`)
				.setTimestamp()

			if (userData.balance === 0) {
				embed.setFooter({ text: `Imagine having no coins, what a loser.` });
			} else if (userData.balance < 10000) {
				embed.setFooter({ text: `Not enough coins, work more!` });
			} else if (userData.balance < 50000) {
				embed.setFooter({ text: `Sounds like a good amount to me. Dont get robbed!` });
			} else {
				embed.setFooter({ text: `Alright, you're the Elon of Musks with that amount of coins...` });
			}

			interaction.reply({
				embeds: [embed],
			});

		} catch (error) {
			console.log(error)
		}
	}
}