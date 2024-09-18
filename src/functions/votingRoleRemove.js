const Schema = require("../schemas/votes.js");
const { INFO, getTimestamp } = require("./utils.js");
async function RVotingRole(client) {
	const timer = 43200000 // 12h in ms
	const data = await Schema.find({}); // should get all data from the userStats schema
	console.log(`[${getTimestamp()}]`, data);

	const ybb = client.config.votes.support.guildId; // YBB server Id
	const ybbR = client.config.votes.support.roleId; // YBB Voting role Id
	if (!client.guilds.cache.size) await client.guilds.fetch();
	const ybbS = await client.guilds.cache.get(ybb);
	if (!ybbS) return console.log('Can\'t find the ybb server to remove vote role');


	if (!data || data.length === 0) return console.log("No data found");

	for (const user of data || []) {
		console.log("in for")
		try {
			console.log(`[${getTimestamp()}]`, Date.now() - user.last >= timer);
		} catch (err) {
			console.log(err);
		}
		if (Date.now() - user.last >= timer) {
			try {
				await INFO('removing the voting role from ' + user.UserId);
			} catch (err) {
				console.log(err);
			}
			try {
				const ybbMember = await ybbS.members.cache.get(user.UserId);
				if (!ybbMember) {
					console.log('Couldn\'t get the ybb member voting');
					continue;
				}
				await ybbMember.roles.remove(ybbR);
			} catch (err) {
				console.log(err);
			}
			try {
				await Schema.findOneAndDelete({ UserId: user.UserId });
			} catch (err) {
				console.log(err);
			}
		}
	}

}

module.exports = { RVotingRole };