const { ChannelType, PermissionsBitField } = require("discord.js");
const fs = require("fs");

async function getInviteCode(guild, client) {
	let Fetch = false;
	let sendMsg = guild.channels.cache.find(
		(channel) => channel.type === ChannelType.GuildText && channel.permissionsFor(guild.members.me).has(PermissionsBitField.Flags.SendMessages)
	);
	let createInv = guild.channels.cache.find(
		(channel) => channel.type === ChannelType.GuildText && channel.permissionsFor(guild.members.me).has(PermissionsBitField.Flags.CreateInstantInvite)
	);
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
	return invite.code;
}

async function allGuilds(client) {
	let localGuilds = [];
	const filePath = "./Invites.json"

	// Load existing guilds from the JSON file if it exists
	if (fs.existsSync(filePath)) {
		const data = fs.readFileSync(filePath, 'utf-8');
		localGuilds = JSON.parse(data);
	}

	// Get current guilds from the bot
	let newGuilds = [];
	newGuilds = await Promise.all(client.guilds.cache.map(async guild => ({
			guildId: guild.id,
			guildName: guild.name,
			Owner: guild.ownerId,
			members: guild.membercount,
			inviteCode: await getInviteCode(guild, client)
		})));

	let isUpdated = false;

	// Check each new guild
	newGuilds.forEach(newGuild => {
		const existingGuild = localGuilds.find(guild => guild.guildId === newGuild.guildId);

		if (existingGuild) {
			// Update guild name if it has changed
			if (existingGuild.guildName !== newGuild.guildName) {
				console.log(`Guild name updated: ${existingGuild.guildName} -> ${newGuild.guildName}`);
				existingGuild.guildName = newGuild.guildName;
				isUpdated = true;
			}
			if (existingGuild.inviteCode !== newGuild.inviteCode) {
				console.log(`${newGuild.guildName} invite code updated: ${existingGuild.inviteCode} -> ${newGuild.inviteCode}`);
				existingGuild.inviteCode = newGuild.inviteCode;
				isUpdated = true;
			}
		} else {
			// Add new guild if it doesn't exist
			localGuilds.push(newGuild);
			console.log(`New guild added: ${newGuild.guildName}`);
			isUpdated = true;
		}
	});

	// Write the updated localGuilds to the file only if there were changes
	if (isUpdated) {
		fs.writeFileSync(filePath, JSON.stringify(localGuilds, null, 2));
		console.log('Guilds updated in guilds.json');
	} else {
		console.log('No changes detected.');
	}
}

module.exports = { allGuilds };