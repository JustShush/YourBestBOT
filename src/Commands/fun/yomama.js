const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	name: "yomama",
	data: new SlashCommandBuilder()
		.setName('yomama')
		.setDescription('Random yomama jokes.'),
	async execute(interaction, client) {
		try {

			// random colors from one dark color palette 
			const colors = ['#282C34', '#E06C75', '#98C379', '#E5C07b', '#61AFEF', '#C678DD', '#56B6C2', '#ABB2BF', '#6B859E', '#3890E9', '#A359ED', '#EC5252', '#C97016', '#5DA713', '#13AFAF'];
			const color = Math.floor(Math.random() * colors.length);
			const resColor = colors[color];
			// end of the color randomization

			const facts = ["Yo Mama\`s so fat, Donald Trump used her as the BORDER WALL!", "Yo Mama\`s so fat, she takes selfies in panorama mode!",
			"Yo Mama\`s so fat, she wakes up on both sides of the BED!", "Yo Mama\`s so fat, she doesnt neeed internet, she is already WORLDWIDE!",
			"Yo Mama\`s so STUPED, she tried to climb the MOUNTAN DEW!", "Yo Mama\`s so fat, she wears to wacthes, on for each time zone she is in!",
			"Yo Mama\`s so fat, when she went on a diet she ended world hunger!", 'Yo Mama\`s so fat, when she died she broke the stair way to heaven!',
			'Yo Mama\`s so fat, when she steped ion a scvale it read my fone number!', 'Yo Mama\`s so fat, Darth Vader couldnt even forece shoke her!',
			'Yo Mama\`s so fat, SNORLAX EVOLVES INTO HER!', 'Yo Mama\`s so stupid, she thought that starbucks was alien currency!',
			'Yo Mama\`s so stupid, when i told her christmas was around the corner she went look for it!', 'Yo Mama\`s so fat, her blood type is NUTELLA!',
			'Yo Mama\`s so fat, her farts cause global warming!', 'Yo Mama\`s so stupid, she got fired from the M&M factory for throwing out the "W"!!',
			'Yo Mama\`s so stupid, she studied for a drug test!', 'Yo Mama\`s so fat, when she climbed to a MONSTER TRUCK it became a LOWRIDER!',
			'Yo Mama\`s so fat, the HORSE on her polo shirt is real!!', 'Yo Mama\`s so stupid, she played got your nose woth voldemort!',
			'Yo Mama\`s so fat, she is a citizen of every country!', 'Yo Mama\`s so fat, her school pictures where taken by a satellite',
			'Yo Mama\`s so fat, even kurby can`t eat her!', 'Yo Mama\`s so stupid, she toke her computer to the docter because it had a virus!',
			'Yo Mama\`s so ugly, that minecraft creepers are afraed of her!', 'Yo Mama\`s so ugly, she made the iluminaty close the eye!',
			"Yo Mama\`s so fat, she uses the highway has a Slip N' Slide!", 'Yo Mama\`s so fat, she puts on her belt with a boomerang!',
			'Yo Mama\`s so fat, her cereal bowl comes with a life guard!', 'Yo Mama\`s so ugly, when she throws the boomerang it refuses to came back!',
			'Yo Mama\`s so stupid, she stayed up all night to cath some sleep!', 'Yo Mama\`s so stupid, she went to the apple store to get a BIG MAC!',
			'Yo Mama\`s so old, her birthday candles cause global warming!', 'Yo Mama\`s so old, her memory is in black and white!',
			'Yo Mama\`s so old, her birth certificate says expired!', "Yo Mama\`s so old, when she went to the musiam she saw some of her ex's",
			'Yo Mama\`s so fat, I took a picture of her last christmas and it is still printing!', 'Yo Mama\`s so fat, when she jumped into a pool NASA found water on MARS!',
			'Yo mama\`s so old 👵🏻, her bible got Jesus autograph!', 'Yo mama\`s so old 👵🏻, she only dreams in black and white!',
			'Yo mama\`s so poor, ducks trow bread at her 🍞!', 'Yo mama\`s so poor, people only rob her house for practice!', 'Yo mama\`s so fat, she on the both sides of the family!',
			'The earth used to be flat, till they buried your mama!'];
			
			const fact = Math.floor(Math.random() * facts.length);
			const result = facts[fact];

			const yomamaEmbed = new EmbedBuilder()
				.setColor(resColor)
				.setTitle('Yo Mama Joke: \n')
				.setDescription(result)
			await interaction.reply({ embeds: [yomamaEmbed] })
		} catch (error) {
			console.log(error)
		}
	}
}