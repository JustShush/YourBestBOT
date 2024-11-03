const { Message } = require('discord.js');
const { exec } = require('child_process');

module.exports = {
	name: "exec",
	description: "Eval scripts",
	permission: "`DEV_ONLY`",
	usage: "`eval <ARGS>`",
	developer: true,
	/**
	 * @param {Message} message
	 * @param {string[]} args
	 */
	execute(message, args) {
		if (message.author.id !== '453944662093332490') return;
		message.delete();
		const cmd = args.join(' ');
		exec(cmd.toString(), { shell: '/bin/bash' }, (error, stdout, stderr) => {
			if (error)
				return console.error(`ERROR: ${error.message}`);
			if (stderr)
				return console.error(`StdErr: ${stderr}`);
			console.log(stdout);
		})
	}
}
