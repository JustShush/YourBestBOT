const { AttachmentBuilder, PermissionFlagsBits } = require("discord.js");
const { sticky } = require("../functions/sticky.js");
const { stealEmoji } = require("../functions/stealEmoji.js");

module.exports = {
	name: "messageCreate",
	commandsArr: ["steal"],
	execute(message, client) {
		if (client.user.id == message.author.id) return;
		sticky(message);
		if (message.author.bot) return;
		const prefix = "+";
		const args = message.content.slice(prefix.length).trim().split(/ +/);
		const command = args.shift().toLowerCase();
		if (command === 'steal') {
			if (!(message.member.permissions.has(PermissionFlagsBits.ManageGuildExpressions))) return message.channel.send({ content: `You don't have the required permissions to run this command.`}).then((msg) => { setTimeout(() => { msg.delete(); }, 5 * 1000);})
			stealEmoji(message, args);
		}
		if (message.content == "test") {
			test(message);
		}
	},
};

const Canvas = require('@napi-rs/canvas');
const { request } = require('undici'); // Using undici to make HTTP requests for better performance
async function test(message) {
	// Create a 700x250 pixel canvas and get its context
	// The context will be used to modify the canvas
	const canvas = Canvas.createCanvas(1100, 500);
	const context = canvas.getContext('2d');

	// Load and draw the space image as the background
	const background = await Canvas.loadImage('./img/space.png');
	context.drawImage(background, 0, 0, canvas.width, canvas.height);

	// Function to draw a circular clip
	function drawCircularClip(x, y, radius) {
		context.beginPath();
		context.arc(x, y, radius, 0, Math.PI * 2);
		context.closePath();
		context.clip();
	}

	// Draw a centered circular clip on top of the background
	const clipX = canvas.width / 2;
	const clipY = (canvas.height / 2) - 100;
	const clipRadius = 100; // Adjust this value to your desired size of the pfp circle
	drawCircularClip(clipX, clipY, clipRadius);

	// Draw the background again to fill the circular clip
	context.drawImage(background, 0, 0, canvas.width, canvas.height);

	// Fetch and draw the author's profile picture
	const { body } = await request(message.author.displayAvatarURL({ format: 'jpg' }));
	const avatar = await Canvas.loadImage(await body.arrayBuffer());

	// Increase the size of the author's profile picture
	const avatarSize = 200; // Adjust this value to your desired size
	const avatarX = clipX - avatarSize / 2;
	const avatarY = (clipY - avatarSize / 2);


	context.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
	// Draw a circular border around the profile picture
	const borderWidth = 50; // Adjust this value to your desired border width
	context.lineWidth = borderWidth;
	context.strokeStyle = 'white'; // Change the color if needed
	drawCircularClip(clipX, clipY, avatarSize / 2 + borderWidth / 2);
	context.stroke();
	// Use the helpful Attachment class structure to process the file for you
	const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'profile-image.png' });

	message.channel.send({ files: [attachment] });
}