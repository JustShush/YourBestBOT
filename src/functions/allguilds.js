const { ChannelType, PermissionsBitField } = require("discord.js");
const fs = require("fs");

async function allGuilds(client) {
	const path = './Guilds.txt'; // Path to the file

	// Check if the file exists Guilds.txt
	fs.access(path, fs.constants.F_OK, (err) => {
		if (err) {
			// File doesn't exist or there was an error
			console.error('File does not exist or cannot be accessed.');
		} else {
			// File exists, so delete it
			fs.unlink(path, (err) => {
				if (err) {
					console.error('Error deleting the file:', err);
				} else {
					//console.log('File deleted successfully.');
				}
			});
		}
	});

	const Invites = readJson('./Invites.json')
	if (!client.guilds.cache.size) await client.guilds.fetch();
	client.guilds.cache.forEach(async guild => {
		let Fetch = false;
		let sendMsg = guild.channels.cache.find(
			(channel) => channel.type === ChannelType.GuildText && channel.permissionsFor(guild.members.me).has(PermissionsBitField.Flags.SendMessages)
		);
		let createInv = guild.channels.cache.find(
			(channel) => channel.type === ChannelType.GuildText && channel.permissionsFor(guild.members.me).has(PermissionsBitField.Flags.CreateInstantInvite)
		);
		// Bot needs MENAGE_GUILD to fetch all the invites in a guild
		if (guild.members.me.permissions.has(PermissionsBitField.Flags.ManageGuild)) Fetch = true;
		let invite = false;
		if (Fetch) {
			let invites = await guild.invites.fetch().catch(err => { console.log("2couldnt fetch the invites in this server! | " + guild.name + " | " + guild.id); return; });

			// Check if the bot has any invites for this server
			const botInvites = await invites.filter((invite) => invite.inviterId === client.user.id);
			if (botInvites.size <= 0) {
				invite = await sendMsg.createInvite({
					maxAge: 0,
					maxUses: 0,
				}).catch(err => console.error("couldnt create a new invite! |SendMessages|", err));
				if (!invite)
					invite = await createInv.createInvite({
						maxAge: 0,
						maxUses: 0,
					}).catch(err => console.error("couldnt create a new invite! |CreateInstantInvite|", err));
			} else {
				botInvites.forEach((inv) => {
					invite = inv;
					return;
				})
			}
		} else {
			const Invs = readJson('./Invites.json')

			if (Invs.invs) {
				Invs.invs.forEach(async (ele) => {
					if (guild.id == ele.guildId)
						invite = await client.fetchInvite(ele.inviteCode);
					return;
				})
			}

			if (createInv) {
				invite = await createInv.createInvite({
					maxAge: 0,
					maxUses: 0,
				}).catch(err => console.error("couldnt create a new invite! |CreateInstantInvite|1", err));
			}
			if (!invite && !createInv) {
				if (sendMsg)
					if (sendMsg.permissionsFor(guild.members.me).has(PermissionsBitField.Flags.CreateInstantInvite))
						invite = await sendMsg.createInvite({
							maxAge: 0,
							maxUses: 0,
					}).catch(err => console.error("couldnt create a new invite! |SendMessages|1", err));
			}
			
			if (!invite) return console.log("couldnt fetch the invites in this server! | " + guild.name + " | " + guild.id);

		}
		Invites.invs.push({
			guildId: guild.id,
			guildName: guild.name,
			inviteCode: invite.code
		})
		writeJson('./Invites.json', Invites);

		let msg = `GuildName: \`${guild.name}\` | id: \`${guild.id}\`\nOwner: <@!${guild.ownerId}> | ${guild.ownerId} | ${guild.memberCount} members\nhttps://discord.gg/${invite.code}\n\n`;
		fs.appendFile("Guilds.txt", msg, (err) => {
			if (err) {
				console.error('Error appending to file:', err);
				return;
			}
			//console.log('All guilds have been saved into: Guilds.txt');
		});
	});
}

/**
 * Reads a json file that you input
 * @param {*} settings the path to the json file
 * @returns json file data
 */
function readJson(settings) {
	try {
		return JSON.parse(fs.readFileSync(settings, 'utf8'));
	} catch (error) {
		console.error('Error reading settings file:', error.message);
		return null;
	}
}

/**
 * Writes data into file json
 * @param {*} file The path of the file you want to save (it has to be json)
 * @param {*} data The data that you want to save into the file
 */
function writeJson(file, data) {
	try {
		fs.writeFileSync(file, JSON.stringify(data, null, 4));
	} catch (error) {
		console.error('Error writing to settings file:', error.message);
	}
}

module.exports = { allGuilds };