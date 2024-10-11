const colors = require('colors');
const Schema = require("../schemas/votes.js");
const UserStatsSchema = require('../schemas/userStats.js');
const { INFO, getTimestamp } = require("./utils.js");
const Config = require("../../config.json");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

async function RVotingRole(client) {
	const timer = 43200000 // 12h in ms
	const data = await Schema.find({}); // should get all data from the userStats schema
	if (!data || data.length === 0) return console.log("No data found");
	console.log(colors.yellow(`[${getTimestamp()}]`), `${data.length} Active Voters!`);

	const ybb = Config.config.votes.support.guildId; // YBB server Id
	const ybbR = Config.config.votes.support.roleId; // YBB Voting role Id
	if (!client.guilds.cache.size) await client.guilds.fetch().catch((err) => console.log(err));
	const ybbS = await client.guilds.cache.get(ybb);
	if (!ybbS) return console.log('Can\'t find the ybb server to remove vote role');
	
	data.forEach(async (user) => {
		if (Date.now() - user.last >= timer) {
			try {
				if (!ybbS.members.cache.size) await ybbS.members.fetch();
				let ybbMember = await ybbS.members.cache.get(user.UserId);
				if (!ybbMember) ybbMember = await ybbS.members.fetch(user.UserId);

				//? DM the member with the remainder to vote again!
				const newEmbed = new EmbedBuilder()
					.setTitle(`<3 Yoo, ${ybbMember.user.globalName}`)
					.setDescription(`<:dot:1289304871467483216> **Looks like you can vote again for me on top.gg! \<3**\n<:dot:1289304871467483216> Vote again to keep awesome perks such as a [voter role in our community server](${client.config.topgg}) and more..\n\nThank you for voting \<3`)
					.setColor("#2B2D31")

				const row = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setLabel("Vote for YourBestBot")
							.setStyle(ButtonStyle.Link)
							.setURL(`${Config.topgg}`)
					)

				await ybbMember.send({ embeds: [newEmbed], components: [row] });

				//? Remove the Voting role from the member
				if (!ybbMember) console.log('Couldn\'t get the ybb member voting');
				await ybbMember.roles.remove(ybbR).catch(console.error);

				const userStats = await UserStatsSchema.findOne({ UserId: user.UserId});
				userStats.isVoter = false;
				await userStats.save();

			} catch (err) {
				console.log(err);
			}
			await INFO('removing the voting role from ' + user.UserId);
			await Schema.findOneAndDelete({ UserId: user.UserId });
		}
	});
}

module.exports = { RVotingRole };
