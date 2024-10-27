const { Message, EmbedBuilder, AttachmentBuilder } = require('discord.js');

module.exports = {
	name: "eval",
	description: "Eval scripts",
	permission: "`DEV_ONLY`",
	usage: "`eval <ARGS>`",
	developer: true,
	/**
	 * @param {Message} message
	 */
	execute(message, args) {
		myEval(message, args);
	}
}

async function myEval(message, args) {
	if (message.author.id !== '453944662093332490') return;

	const command = args.join(" ");
	if (!command) return message.channel.send("you must write a command ")

	let words = ["token", "destroy", "config"]
	if (words.some(word => message.content.toLowerCase().includes(word))) {
		return message.channel.send("Those words are blacklisted!")
	}

	const clean = text => {
		if (typeof (text) === "string")
			return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
		else
			return text;
	}

	try {
		let evaled;
		if (command.includes("await")) evaled = await eval(`async() => ${command}`)();
		else evaled = await eval(command)
		if (typeof evaled !== "string") evaled = require('util').inspect(evaled, { depth: 3 });

		const res = clean(evaled);

		if (evaled.length >= 1500) message.channel.send({ files: [new AttachmentBuilder(Buffer.from(res, 'utf-8')).setName('Evaled code.txt')] });
		else message.channel.send({ content: `\`\`\`js\n${evaled}\`\`\`` });

	} catch (error) {
		const embedfailure = new EmbedBuilder()
			.setColor("#FF0000")
			.addFields({ name: `Entrance`, value: `\`\`\`js\n${command}\`\`\`` })
			.addFields({ name: `Error`, value: `\`\`\`js\n${error}\`\`\` ` })

		message.channel.send({ embeds: [embedfailure] })
	}
}