const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
	name: "staff-list",
	developer: true,
	data: new SlashCommandBuilder()
		.setName("staff")
		.setDescription("Gives you all the staff members on Webex mas aqui!")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction, client) {
		const list = client.guilds.cache.get(`702545447750860931`);
		await list.members.fetch();

		/* //check for trainees
		if (list.roles.cache.get(`946525021545828422`).members.size === 0) {
			client.trainees = `There is currently no staff member in the position of \`Trainee Moderator\`.`;
		} else {
			client.trainees = list.roles.cache.get(`946525021545828422`).members.map((m) => {
				if (!m.presence || m.presence.status === "offline") {
					return `<:offline:989591896521338971> \`${m.user.tag}\` `;
				} else if (m.presence.status === `online`) {
					return `<:online:989591925407481857> \`${m.user.tag}\` `;
				} else if (m.presence.status === `dnd`) {
					return `<:dnd:989591866213290004> \`${m.user.tag}\` `;
				} else if (m.presence.status === `idle`) {
					return `<:idle:989591949994491934> \`${m.user.tag}\` `;
				}
			});
		} */

		//check for satff
		let staffId = `724629524180107304`
		if (list.roles.cache.get(staffId).members.size === 0) {
			client.staff = `There is currently no staff member in the position of \`Staff\`.`;
		} else {
			client.staff = list.roles.cache.get(staffId).members.map((m) => {
				if (!m.presence || m.presence.status === "offline") {
					return `<:offline:989591896521338971> \`${m.user.tag}\` `;
				} else if (m.presence.status === `online`) {
					return `<:online:989591925407481857> \`${m.user.tag}\` `;
				} else if (m.presence.status === `dnd`) {
					return `<:dnd:989591866213290004> \`${m.user.tag}\` `;
				} else if (m.presence.status === `idle`) {
					return `<:idle:989591949994491934> \`${m.user.tag}\` `;
				}
			});
		}

		//check for admins
		let adminId = `939497997442641960`
		if (list.roles.cache.get(adminId).members.size === 0) {
			client.admins = `There is currently no staff member in the position of \`Admin\`.`;
		} else {
			client.admins = list.roles.cache.get(adminId).members.map((m) => {
				if (!m.presence || m.presence.status === "offline") {
					return `<:offline:989591896521338971> \`${m.user.tag}\` `;
				} else if (m.presence.status === `online`) {
					return `<:online:989591925407481857> \`${m.user.tag}\` `;
				} else if (m.presence.status === `dnd`) {
					return `<:dnd:989591866213290004> \`${m.user.tag}\` `;
				} else if (m.presence.status === `idle`) {
					return `<:idle:989591949994491934> \`${m.user.tag}\` `;
				}
			});
		}

		//check for owners/head admin
		let ownersId = `723282558686855218`
		if (list.roles.cache.get(ownersId).members.size === 0) {
			client.owners = `There is currently no staff member in the position of \`Head Admin\`.`;
		} else {
			client.owners = list.roles.cache.get(ownersId).members.map((m) => {
				if (!m.presence || m.presence.status === "offline") {
					return `<:offline:989591896521338971> \`${m.user.tag}\` `;
				} else if (m.presence.status === `online`) {
					return `<:online:989591925407481857> \`${m.user.tag}\` `;
				} else if (m.presence.status === `dnd`) {
					return `<:dnd:989591866213290004> \`${m.user.tag}\` `;
				} else if (m.presence.status === `idle`) {
					return `<:idle:989591949994491934> \`${m.user.tag}\` `;
				}
			});
		}

		const embed = new EmbedBuilder()
		.setAuthor({ name: `Staff List` })
		.setDescription(
			`
Here are the current staff members, their position, and their status:
**Head Admins:**
${client.owners.toString().replaceAll(`,`, ` `)}
**Admins:**
${client.admins.toString().replaceAll(`,`, ` `)}
**Staff:**
${client.staff.toString().replaceAll(`,`, ` `)}
`
/* **Trainee Moderators:**
${client.trainees.toString().replaceAll(`,`, ` `)} */
		)
		.setColor(`#ff3067`)
		.setTimestamp()

		interaction.reply({
			embeds: [embed],
		});
	},
};
