const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const fs = require("fs");
const path = require("path");
const Canvas = require("canvas");
const axios = require("axios");

module.exports = {
	name: "border",
	description: "Show bot's status",
	permission: "`SEND_MESSAGES`",
	usage: "`/border`",
	type: "Misc",
	data: new SlashCommandBuilder()
		.setName("border")
		.setDescription("Show bot's status")
		.setContexts(0, 1, 2) // 0 for guild | 1 for botDM | 2 everywhere
		.setIntegrationTypes(0, 1) // 0 for guild install | 1 for user install
		.setNSFW(false),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction, client) {
		await interaction.deferReply();

		const user = interaction.user;
		const avatarURL = user.displayAvatarURL({ format: "png", size: 512 });
		const bordersFolder = path.join("./assets/borders");

		const files = fs.readdirSync(bordersFolder).filter(file => file.endsWith(".png") || file.endsWith(".gif"));
		if (files.length === 0) return interaction.editReply("No borders available.");

		const randomBorder = files[Math.floor(Math.random() * files.length)];
		const borderPath = path.join(bordersFolder, randomBorder);

		try {
			// Download avatar
			const avatarBuffer = (await axios.get(avatarURL, { responseType: "arraybuffer" })).data;
			const avatarImage = await Canvas.loadImage(avatarBuffer);

			let borderImage;

			if (borderPath.endsWith(".gif")) {
				console.log("Border is a GIF, extracting first frame...");
				const frameData = await gifFrames({ url: borderPath, frames: 0, outputType: "canvas" });
				borderImage = frameData[0].getImage(); // Get first frame
			} else {
				borderImage = await Canvas.loadImage(borderPath);
			}

			// Create canvas
			const canvas = Canvas.createCanvas(512, 512);
			const ctx = canvas.getContext("2d");

			// Draw avatar
			ctx.drawImage(avatarImage, 0, 0, 512, 512);

			// Draw border
			ctx.drawImage(borderImage, 0, 0, 512, 512);

			// Convert canvas to buffer
			const finalImage = canvas.toBuffer("image/png");

			// Send image
			const attachment = new AttachmentBuilder(finalImage, { name: "avatar_with_border.png" });
			await interaction.editReply({ files: [attachment] });

		} catch (err) {
			console.error(err);
			return interaction.editReply(`Error: ${err.message}`);
		}
	}
}