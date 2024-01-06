const { ChannelType } = require("discord.js");
const fs = require("fs");

function allGuilds(client) {
	const path = './Guilds.txt'; // Path to the file

	// Check if the file exists
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
					console.log('File deleted successfully.');
				}
			});
		}
	});
	client.guilds.cache.forEach(async guild => {
		let found = guild.channels.cache.find(
			(channel) => channel.type === ChannelType.GuildText && channel.permissionsFor(guild.members.me).has("SendMessages")
		);
		let invites = await guild.invites.fetch().catch(err => { console.log("couldnt fetch the invites in this server!"); return; });
		if (!invites) return;
		// Check if the bot has any invites for this server
		const botInvites = invites.filter((invite) => invite.inviter.id === client.user.id);
		let invite;
		if (botInvites.size <= 0) {
			invite = await found.createInvite({
				maxAge: 0,
				maxUses: 0,
			}).catch(err => console.error("could create a new invite!", err));
		} else {
			botInvites.forEach((inv) => {
				invite = inv;
				return;
			})
		}
		console.log(invite.code)
		let msg = `GuildName: \`${guild.name}\` | id: \`${guild.id}\`\nOwner: <@!${guild.ownerId}> | ${guild.ownerId} | ${guild.memberCount} members\nhttps://discord.gg/${invite.code}\n\n`;
		fs.appendFile("Guilds.txt", msg, (err) => {
			if (err) {
				console.error('Error appending to file:', err);
				return;
			}
			console.log('All guilds have been saved into: Guilds.txt');
		});
	});
}

module.exports = { allGuilds };