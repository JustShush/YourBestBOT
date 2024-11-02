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