const { EmbedBuilder, SlashCommandBuilder, Colors } = require('discord.js');
//const fetch = require('node-fetch')
module.exports = {
	name: "dadjokes",
	data: new SlashCommandBuilder()
		.setName('dadjokes')
		.setDescription('Random dadjokes'),
	async execute(interaction, client) {
		try {

			// random colors from one dark color palette 
			const colors = ['#282C34', '#E06C75', '#98C379', '#E5C07b', '#61AFEF', '#C678DD', '#56B6C2', '#ABB2BF', '#6B859E', '#3890E9', '#A359ED', '#EC5252', '#C97016', '#5DA713', '#13AFAF'];
			const color = Math.floor(Math.random() * colors.length);
			const resColor = colors[color];
			// end of the color randomization 

			const facts = ["I’ve just been reading a book about anti-gravity, it’s impossible to put down!", "Why did the kid throw the clock out the window?\n||He wanted to see time fly!||",
				"I just wrote a book on reverse psychology. Do not read it!", "I just broke my guitar. It's okay, I won't fret",
				"Me: If humans lose the ability to hear high frequency volumes as they get older, can my 4 week old son hear a dog whistle?\nDoctor: No, humans can never hear that high of a frequency no matter what age they are.\nMe: Trick question... dogs can't whistle.",
				"Why do bears have hairy coats? Fur protection.", "A man walked in to a bar with some asphalt on his arm. He said \“Two beers please, one for me and one for the road.\”",
				"Why do birds fly south for the winter?\n||Because it's too far to walk.||", "When my wife told me to stop impersonating a flamingo, I had to put my foot down.",
				"I decided to sell my Hoover… well it was just collecting dust.", "It takes guts to be an organ donor.", "What are the strongest days of the week?\n||Saturday and Sunday...the rest are weekdays.||",
				"What do I look like? A JOKE MACHINE!?", "What did the fish say when it swam into a wall?\n||Damn!||", "My new thesaurus is terrible. In fact, it's so bad, I'd say it's terrible.",
				"I had a rough day, and then somebody went and ripped the front and back pages from my dictionary. It just goes from bad to worse.", "People are making apocalypse jokes like there’s no tomorrow.",
				"What do you call a dad that has fallen through the ice?\n||A Popsicle.||", "You can't run through a camp site. You can only ran, because it's past tents.", "Chances are if you' ve seen one shopping center, you've seen a mall.",
				"Just watched a documentary about beavers… It was the best damn program I’ve ever seen.", "What did the late tomato say to the early tomato?\n||I’ll ketch up||",
				"The other day I was listening to a song about superglue, it’s been stuck in my head ever since.", "Why is it so windy inside an arena?\n||All those fans.||",
				"Want to hear a joke about pizza??\n|| Never mind, its too \"cheesy\".||"];
			const fact = Math.floor(Math.random() * facts.length);
			const result = facts[fact];
			/* let response = await fetch(`https://icanhazdadjoke.com/slack`);
			let data = await response.text();
			const img = JSON.parse(data) */
			const embed = new EmbedBuilder()
				.setTitle("Dad Jokes: ")
				.setFooter({ text: 'Ty icanhazdadjoke.com for the jokes <3' })
				.setColor(resColor)
				.setDescription(result)
			await interaction.reply({ embeds: [embed] })
		} catch (error) {
			console.log(error)
		}
	}
}