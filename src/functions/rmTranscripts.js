const TTranscriptSchema = require('../schemas/TicketTranscripts.js');

/**
 * Removes old transcripts from the database, transcripts that are more then 7 days old.  
 * 
 * Maybe in the future make it so it save for 7 days for free and like 3months for premium users idk.
 */
async function rmTranscripts() {
	const sevenDaysAgo = new Date();
	sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

	try {
		const result = await TTranscriptSchema.deleteMany({ createdAt: { $lt: sevenDaysAgo } });
		console.log(`Deleted all the tickets that where more then 7 days old.`, result);
	} catch (err) {
		console.log(err, 'Something when wrong in: ' + __filename);
	}

}

module.exports = { rmTranscripts };