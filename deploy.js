const colors = require("colors");
const { REST, Routes } = require('discord.js');
const { clientId, TOKEN } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];

const commandFoldersPath = path.join(__dirname + "/src/", 'Commands');
const commandFolders = fs.readdirSync(commandFoldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(commandFoldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			let commandJSON = command.data.toJSON();
			if (command.integration_types) commandJSON.integration_types = command.integration_types;
			if (command.contexts) commandJSON.contexts = command.contexts;
			commands.push(commandJSON);
			//commands.push(command.data);
		} else
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

function findDuplicateCommands(cmds) {
	const names = cmds.map(cmd => cmd.name);
	const seen = new Set();
	const duplicates = new Set();

	for (const name of names) {
		if (seen.has(name)) duplicates.add(name);
		seen.add(name);
	}

	return [...duplicates];
}

// 🔍 Detect duplicates BEFORE deploying
const duplicates = findDuplicateCommands(commands);
if (duplicates.length > 0) {
	console.log("\n❌ Duplicate command names detected!".red.bold);
	duplicates.forEach(d => console.log(` - ${d}`.red));
	console.log("\nFix duplicates before redeploying.\n".yellow);
	process.exit(1); // Stop script to prevent Discord API errors
}

const rest = new REST().setToken(TOKEN);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands and context menus.`.yellow);

		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log(`[1] Successfully reloaded ${data.length} application (/) commands and context menus.`.brightBlue.bold);

	} catch (error) {
		console.error(error);
	}
})();