const { AttachmentBuilder } = require('discord.js');
const { createCanvas } = require('canvas');
const euroMilhoesModel = require("../schemas/euroMilhoes");

const Lojas = {
	TACOS: "1440751100679422094",
	Hogs: "1440751133223161976",
	Barrigas: "1440765613965316096",
	Chines: "1440765655199649984",
	Malibu: "1440765796161687775",
	Bahamas: "1440765899903860887",
	PDM: "1440765946158514377",
	Fiandeiro: "1440766258659459072",
	Bennys: "1440830577052749908",
	TuneTown: "1440830614973583382"
}

// Helper function to get all combinations
function getCombinations(arr, size) {
	const result = [];

	function backtrack(start, current) {
		if (current.length === size) {
			result.push([...current]);
			return;
		}

		for (let i = start; i < arr.length; i++) {
			current.push(arr[i]);
			backtrack(i + 1, current);
			current.pop();
		}
	}

	backtrack(0, []);
	return result;
}

// Create ticket image
function createTicketImage(phoneNumber, combinations) {
	const lineHeight = 60;
	const headerHeight = 80;
	const footerHeight = 50;
	const padding = 20;
	const canvasHeight = headerHeight + (combinations.length * lineHeight) + footerHeight + padding;

	const canvas = createCanvas(700, Math.max(400, canvasHeight));
	const ctx = canvas.getContext('2d');

	// Background
	ctx.fillStyle = '#2C2F33';
	ctx.fillRect(0, 0, 700, canvas.height);

	// Header
	ctx.fillStyle = '#5865F2';
	ctx.fillRect(0, 0, 700, headerHeight);

	// Title
	ctx.fillStyle = '#FFFFFF';
	ctx.font = 'bold 32px Arial';
	ctx.textAlign = 'center';
	ctx.fillText('EUROMILHÕES', 350, 50);

	// Phone number
	ctx.fillStyle = '#FFFFFF';
	ctx.font = '20px Arial';
	ctx.textAlign = 'left';
	ctx.fillText('Phone:', 30, headerHeight + 35);
	ctx.fillStyle = '#00FF00';
	ctx.fillText(phoneNumber, 130, headerHeight + 35);

	// Draw all combinations
	let yPos = headerHeight + 80;
	ctx.fillStyle = '#FFFFFF';
	ctx.font = 'bold 18px Arial';

	combinations.forEach((combo, index) => {
		const numerosStr = combo.numeros.join(' - ');
		const estrelasStr = combo.estrelas.join(' - ');

		ctx.fillStyle = '#FFD700';
		ctx.fillText(`#${index + 1}:`, 30, yPos);

		ctx.fillStyle = '#FFFFFF';
		ctx.fillText('Numbers:', 80, yPos);
		ctx.fillStyle = '#00FF00';
		ctx.fillText(numerosStr, 190, yPos);

		ctx.fillStyle = '#FFFFFF';
		ctx.fillText('Stars:', 450, yPos);
		ctx.fillStyle = '#FFA500';
		ctx.fillText(estrelasStr, 530, yPos);

		yPos += lineHeight;
	});

	// Footer
	ctx.fillStyle = '#99AAB5';
	ctx.font = '16px Arial';
	ctx.textAlign = 'center';
	ctx.fillText(`Total: ${combinations.length} combination(s) | Good luck!`, 350, canvas.height - 20);

	return canvas.toBuffer();
}

// Modal submit handler
async function handleModalSubmit(interaction) {
	if (interaction.customId !== 'ticketModal') return;

	await interaction.deferReply();

	// Check if user has any of the allowed roles
	const memberRoles = interaction.member.roles.cache;
	const allowedRoleIds = Object.values(Lojas);
	const hasPermission = memberRoles.some(role => allowedRoleIds.includes(role.id));

	if (!hasPermission) {
		return await interaction.editReply({
			content: '❌ You do not have permission to create tickets. You need one of the store roles.',
			ephemeral: true
		});
	}

	// Get which store role the user has
	const userStore = Object.keys(Lojas).find(storeName =>
		memberRoles.has(Lojas[storeName])
	);

	console.log(`User ${interaction.user.username} has ${userStore} role - Permission granted`);

	// Get modal values
	const phoneNumber = interaction.fields.getTextInputValue('phoneNumber');
	const number1Input = interaction.fields.getTextInputValue('number1');
	const number2Input = interaction.fields.getTextInputValue('number2');

	// Parse numbers from inputs (supports spaces, commas, etc.)
	const parseNumbers = (input) => {
		return input.split(/[\s,]+/).map(n => parseInt(n.trim())).filter(n => !isNaN(n));
	};

	const numeros = parseNumbers(number1Input);
	const estrelas = parseNumbers(number2Input);

	console.log(`Parsed Numeros: ${numeros}, Estrelas: ${estrelas}`);

	// Generate all combinations
	const combinations = [];

	console.log(`Checking conditions: numeros.length=${numeros.length}, estrelas.length=${estrelas.length}`);

	if (numeros.length === 4 && estrelas.length > 1) {
		// If exactly 4 numbers and multiple stars, create one combination per star
		console.log('Using condition: 4 numbers + multiple stars');
		for (const estrela of estrelas) {
			console.log(`Adding combination with estrela: ${estrela}`);
			combinations.push({
				numeros: numeros,
				estrelas: [estrela]
			});
		}
	} else if (numeros.length > 4 && estrelas.length >= 1) {
		// If more than 4 numbers, create all combinations of 4 numbers with each star
		console.log('Using condition: more than 4 numbers');
		const numeroCombos = getCombinations(numeros, 4);

		for (const numCombo of numeroCombos) {
			for (const estrela of estrelas) {
				combinations.push({
					numeros: numCombo,
					estrelas: [estrela]
				});
			}
		}
	} else if (numeros.length === 4 && estrelas.length === 1) {
		// Exactly 4 numbers and 1 star
		console.log('Using condition: 4 numbers + 1 star');
		combinations.push({
			numeros: numeros,
			estrelas: estrelas
		});
	} else {
		// Simple case - just save as is
		console.log('Using condition: simple case');
		combinations.push({
			numeros: numeros,
			estrelas: estrelas
		});
	}

	console.log(`Generated ${combinations.length} combinations`);

	// Save to MongoDB using Mongoose schema
	try {
		const savedTickets = [];

		// Save each combination to database
		for (const combo of combinations) {
			const ticket = await euroMilhoesModel.create({
				GuildName: interaction.guild.name,
				Guild: interaction.guild.id,
				UserId: interaction.user.id,
				phoneNumber: parseInt(phoneNumber),
				Numeros: combo.numeros,
				Estrelas: combo.estrelas,
				Estabelecimento: userStore
			});

			savedTickets.push(ticket);
			console.log(`✅ Ticket saved: ${ticket._id} - Numeros: [${combo.numeros}] Estrelas: [${combo.estrelas}] - Store: ${userStore}`);
		}

		// Generate ticket image with all combinations
		const imageBuffer = createTicketImage(phoneNumber, combinations);
		const attachment = new AttachmentBuilder(imageBuffer, { name: 'ticket.png' });

		await interaction.editReply({
			content: `✅ ${savedTickets.length} ticket(s) created successfully!`,
			files: [attachment]
		});

	} catch (error) {
		console.error('Error saving ticket:', error);
		await interaction.editReply({
			content: '❌ Error creating ticket. Please try again.',
			ephemeral: true
		});
	}
}

module.exports = { handleModalSubmit };