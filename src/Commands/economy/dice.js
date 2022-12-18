const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const EconomyChecker = require("../../schemas/economy_checker");

module.exports = {
	name: "dice",
	data: new SlashCommandBuilder()
		.setName('dice')
		.setDescription('Make a bet and roll two dice against the bot, whoever has the higher roll wins.')
		.addNumberOption(option => option
			.setName("amount")
			.setDescription("Bet amount")
			.setRequired(true)),
	async execute(interaction, client) {
		try {

			// random colors from one dark color palette 
			const colors = ['#282C34', '#E06C75', '#98C379', '#E5C07b', '#61AFEF', '#C678DD', '#56B6C2', '#ABB2BF', '#6B859E', '#3890E9', '#A359ED', '#EC5252', '#C97016', '#5DA713', '#13AFAF'];
			const color = Math.floor(Math.random() * colors.length);
			const resColor = colors[color];
			// end of the color randomization

			const { options } = interaction

			const Coins = options.getNumber("amount");

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
					dice_cooldown: 0
				});
			}

			const coins = Math.floor(Coins * 1.5);
			const coins2 = Math.floor(Coins * 2);
			if (Math.floor(Date.now() / 1000) <= userData.dice_cooldown) {
				return interaction.reply({
					embeds: [
						new EmbedBuilder()
							.setAuthor({ name: `Cooldown` })
							.setDescription(`You are currently on cooldown! You can only ask for money again at <t:${userData.dice_cooldown}:T>.`)
							.setColor(resColor),
					],
					ephemeral: true,
				});
			}

			const embed = new EmbedBuilder()
				.setTitle(`${interaction.user.username} you have bet **${Coins}** coins.`)
				.setColor(resColor)
				.setTimestamp()

			const diceF = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
			const diceU = Math.floor(Math.random() * diceF.length);
			const diceU1 = Math.floor(Math.random() * diceF.length);
			const diceB = Math.floor(Math.random() * diceF.length);
			const diceB1 = Math.floor(Math.random() * diceF.length);
			const resUser = diceF[diceU];
			const resUser1 = diceF[diceU1];
			const resUDice = resUser + resUser1;
			const resBot = diceF[diceB];
			const resBot1 = diceF[diceB1];
			const resBDice = resBot + resBot1;

			let new_balance = 0;
			if (resUDice > resBDice && resUser == resUser1) { embed.setDescription(`You got **${resUser}** and **${resUser1}**\nYourBestBot got **${resBot}** and **${resBot1}**\n\nWich means that you won! And since you rolled a double you won twice your bet. **${coins2}** coins!🎉`); new_balance = Math.floor(userData.balance + coins2); }
			if (resUDice > resBDice) { embed.setDescription(`You got **${resUser}** and **${resUser1}**\nYourBestBot got **${resBot}** and **${resBot1}**\n\nWich means that you won! Here\'s your prize **${coins}** coins!🎉`); new_balance = Math.floor(userData.balance + coins); }
			if (resUDice == resBDice) embed.setDescription(`You got **${resUser}** and **${resUser1}**\nYourBestBot got **${resBot}** and **${resBot1}**\n\nWich means that its a tie! Here goes your coins back ${Coins}`);
			if (resUDice < resBDice) { embed.setDescription(`You got **${resUser}** and **${resUser1}**\nYourBestBot got **${resBot}** and **${resBot1}**\n\nWich means that you lost! You lost ${Coins} coins \:(`); new_balance = Math.floor(userData.balance - coins); };

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
			const cooldown = Math.floor(Date.now() / 1000 + (2 * 60)); // 2 min cooldown (2 * 60)
			userData.dice_cooldown = cooldown;
			userData.balance = new_balance;
			await userData.save();

		} catch (error) {
			console.log(error)
		}
	}
}