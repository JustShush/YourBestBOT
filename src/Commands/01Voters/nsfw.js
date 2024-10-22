const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, PermissionFlagsBits } = require("discord.js");
const axios = require('axios');
const UserStatsSchema = require('../../schemas/userStats.js');

module.exports = {
	name: "nsfw",
	description: "Get Various NSFW imgs/gifs",
	permission: "`SEND_MESSAGES`",
	subcommand: true,
	type: "Voter",
	data: new SlashCommandBuilder()
		.setName("nsfw")
		.setDescription("nsfw")
		.addSubcommand(sub => sub
			.setName('4k')
			.setDescription('4k image of any nsfw')
		)
		.addSubcommand(sub => sub
			.setName('anal')
			.setDescription('anal gifs or image')
		)
		.addSubcommand(sub => sub
			.setName('porngif')
			.setDescription('porn gif of anything')
		)
		.addSubcommand(sub => sub
			.setName('ass')
			.setDescription('ass pic')
		)
		.addSubcommand(sub => sub
			.setName('gonewild')
			.setDescription('girls going wild')
		)
		.addSubcommand(sub => sub
			.setName('hentai')
			.setDescription('hentai porn')
		)
		.addSubcommand(sub => sub
			.setName('boobs')
			.setDescription('boobies :D')
		)
		.addSubcommand(sub => sub
			.setName('pussy')
			.setDescription('pussy pictures, includes boobies too')
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands, PermissionFlagsBits.SendMessages)
		.setDMPermission(true)
		.setNSFW(false),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction) {
		if (!interaction.channel.nsfw) {
			const img = new AttachmentBuilder('./img/ageRestrict.png');
			const newEmbed = new EmbedBuilder()
				.setTitle('you can not use this command')
				.setDescription('pls make sure you have **NSFW** channel enabled')
				.setImage('attachment://ageRestrict.png')
			return interaction.reply({ embeds: [newEmbed], files: [img], ephemeral: true });
		}

		const userStats = await UserStatsSchema.findOne({ UserId: interaction.user.id }).catch(err => console.log(err));
		if (!userStats) return interaction.reply({ content: 'Something when wrong getting user data.', ephemeral: true });

		const returnEmbed = new EmbedBuilder()
			.setTitle('It looks like your not a voter :(')
			.setDescription('To run this command you need to vote for me [over on top.gg](https://yourbestbot.pt/vote)\nYou can get more info on why using the command: </vote:1294067743296847944> \<3')

		if (!userStats.isVoter) return interaction.reply({ embeds: [returnEmbed], ephemeral: true });

		const cmd = interaction.options.getSubcommand();

		const res = await axios.get(`https://nekobot.xyz/api/image?type=${cmd}`).catch(err => console.log(err));
		if (!res) return interaction.reply({ content: 'Something when wrong getting the img.', ephemeral: true });
		const img = res.data.message;

		const newEmbed = new EmbedBuilder()
			.setTitle(`${cmd}`)
			.setURL(img)
			.setImage(img)

		interaction.reply({ embeds: [newEmbed] });
	}
}
