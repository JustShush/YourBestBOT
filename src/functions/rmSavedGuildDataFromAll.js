const EconomyCheckerSchema = require('../schemas/economy_checker.js');
const FilterSchema = require('../schemas/filter.js');
const GoodByeSchema = require('../schemas/goodbye.js');
const GWSchema = require('../schemas/gwSchema.js');
const InfractionsSchema = require('../schemas/Infractions.js');
const JobCheckerSchema = require('../schemas/job_checker.js');
const LogSchema = require('../schemas/log.js');
const NickSysSchema = require('../schemas/nickSys.js');
const StickySchema = require('../schemas/stickySys.js');
const TicketSchema = require('../schemas/TicketSys.js');
const WarnsSchema = require('../schemas/warn.js');
const WerlcomeSchema = require('../schemas/welcome.js');

async function rmSavedGuildDataFromAll(guild) {
	const resEconomy = await EconomyCheckerSchema.deleteMany({ Guild: guild.id }).catch((err) => { console.error(`Error removing EconomyCheckerSchema documents for Guild ID: ${guild.id}`, err);})
	if (resEconomy) console.log(`Deleted ${resEconomy.deletedCount} EconomyCheckerSchema document(s) for Guild ID: ${guild.id}`);
	const resFilter = await FilterSchema.deleteMany({ GuildId: guild.id }).catch((err) => { console.error(`Error removing FilterSchema documents for Guild ID: ${guild.id}`, err);})
	if (resFilter) console.log(`Deleted ${resFilter.deletedCount} FilterSchema document(s) for Guild ID: ${guild.id}`);
	const resGoodBye = await GoodByeSchema.deleteMany({ Guild: guild.id }).catch((err) => { console.error(`Error removing GoodByeSchema documents for Guild ID: ${guild.id}`, err);})
	if (resGoodBye) console.log(`Deleted ${resGoodBye.deletedCount} GoodByeSchema document(s) for Guild ID: ${guild.id}`);
	const resGwSchema = await GWSchema.deleteMany({ GuildId: guild.id }).catch((err) => { console.error(`Error removing GWSchema documents for Guild ID: ${guild.id}`, err);})
	if (resGoodBye) console.log(`Deleted ${resGwSchema.deletedCount} GWSchema document(s) for Guild ID: ${guild.id}`);
	const resInfraction = await InfractionsSchema.deleteMany({ Guild: guild.id }).catch((err) => { console.error(`Error removing InfractionsSchema documents for Guild ID: ${guild.id}`, err);})
	if (resInfraction) console.log(`Deleted ${resInfraction.deletedCount} InfractionsSchema document(s) for Guild ID: ${guild.id}`);
	const resJobChecker = await JobCheckerSchema.deleteMany({ Guild: guild.id }).catch((err) => { console.error(`Error removing JobCheckerSchema documents for Guild ID: ${guild.id}`, err);})
	if (resJobChecker) console.log(`Deleted ${resJobChecker.deletedCount} JobCheckerSchema document(s) for Guild ID: ${guild.id}`);
	const resLogs = await LogSchema.deleteMany({ Guild: guild.id }).catch((err) => { console.error(`Error removing LogSchema documents for Guild ID: ${guild.id}`, err);})
	if (resLogs) console.log(`Deleted ${resLogs.deletedCount} LogSchema document(s) for Guild ID: ${guild.id}`);
	const resNickSys = await NickSysSchema.deleteMany({ Guild: guild.id }).catch((err) => { console.error(`Error removing NickSysSchema documents for Guild ID: ${guild.id}`, err);})
	if (resNickSys) console.log(`Deleted ${resNickSys.deletedCount} NickSysSchema document(s) for Guild ID: ${guild.id}`);
	const resStickySys = await StickySchema.deleteMany({ Guild: guild.id }).catch((err) => { console.error(`Error removing StickySchema documents for Guild ID: ${guild.id}`, err);})
	if (resStickySys) console.log(`Deleted ${resStickySys.deletedCount} StickySchema document(s) for Guild ID: ${guild.id}`);
	const resTicketSys = await TicketSchema.deleteMany({ GuildId: guild.id }).catch((err) => { console.error(`Error removing TicketSchema documents for Guild ID: ${guild.id}`, err);})
	if (resStickySys) console.log(`Deleted ${resTicketSys.deletedCount} TicketSchema document(s) for Guild ID: ${guild.id}`);
	const resWarns = await WarnsSchema.deleteMany({ GuildId: guild.id }).catch((err) => { console.error(`Error removing WarnsSchema documents for Guild ID: ${guild.id}`, err);})
	if (resWarns) console.log(`Deleted ${resWarns.deletedCount} WarnsSchema document(s) for Guild ID: ${guild.id}`);
	const resWelcome = await WerlcomeSchema.deleteMany({ Guild: guild.id }).catch((err) => { console.error(`Error removing WerlcomeSchema documents for Guild ID: ${guild.id}`, err);})
	if (resWelcome) console.log(`Deleted ${resWelcome.deletedCount} WerlcomeSchema document(s) for Guild ID: ${guild.id}`);
}

module.exports = { rmSavedGuildDataFromAll };