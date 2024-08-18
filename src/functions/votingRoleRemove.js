const Schema = require("../schemas/userStats.js");
const { INFO } = require("./utils.js");
async function RVotingRole(client) {
	const timer = 43200000 // 12h in ms
	const data = await Schema.find({}); // should get all data from the userStats schema
	console.log(data);
	data.forEach(async user => {
		if (user.Votes.last >= user.Votes.last + timer) {
			INFO('removing the voting role from' + user.User);
			const ybb = client.config.votes.support.guildId; // YBB server Id
			const ybbR = client.config.votes.support.roleId; // YBB Voting role Id
			const ybbS = await client.guilds.cache.get(ybb);
			if (!ybbS) return INFO('Can\'t find the ybb server remove vote role');
			const ybbMember = await ybbS.member.cache.get(user.UserId);
			if (!ybbMember) return INFO('Couln\'t get the ybb member voting');
			await ybbMember.roles.remove(ybbR);
		}
	})

}

module.exports = { RVotingRole };