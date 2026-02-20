const { SlashCommandBuilder, MessageFlags, PermissionFlagsBits } = require('discord.js');
const { checkExistingWebHookInChannel } = require("../../functions/utils");

module.exports = {
	name: "japabets",
	description: "Send",
	permission: "`SEND_MESSAGES`",
	usage: "`/japabets`",
	type: "Utility ⚙️",
	data: new SlashCommandBuilder()
		.setName('japabets')
		.setDescription('Get a larger version of a user\'s avatar')
		.addSubcommand(sub => sub
			.setName('prompts')
			.setDescription('Prompts Tickets')
			.addUserOption((o) => o
				.setName("member")
				.setDescription("A pessoa que querem responder")
				.setRequired(true))
			.addStringOption(o => o
				.setName('japabetsmsg')
				.setDescription('Escolhe a mensagem para enviar.')
				.setRequired(true)
				.addChoices(
					{ name: 'Konnichiwa', value: 'konnichiwa' },
					{ name: 'Konnichiwa 2.5k', value: 'konnichiwa2' },
					{ name: 'Receber', value: 'receber' },
					{ name: 'Pagar', value: 'pagar' },
					{ name: 'Check', value: 'check' }
				))
		)
		.addSubcommand(sub => sub
			.setName('recovery')
			.setDescription('Recover a user password')
			.addStringOption((o) => o
				.setName("username")
				.setDescription("Username da pessoa no site")
				.setRequired(true))
		)
		.setContexts(0) // 0 for guild | 1 for botDM | 2 everywhere
		.setIntegrationTypes(0) // 0 for guild install | 1 for user install
		.setNSFW(false),
	async execute(interaction) {

		switch (interaction.options.getSubcommand()) {
			case 'prompts':
				const channel = interaction.channel;

				const roleId = "1449922830698549290"; // 🟣 運営  — Direção / Operação da JAPA BET
				const member = await interaction.guild.members.fetch(interaction.user.id);
				if (!member.roles.cache.has(roleId)) {
					return interaction.reply({ content: "We are sorry but you cannot use this command!", flags: MessageFlags.Ephemeral });
				}

				// Safety check
				if (!channel || !channel.isTextBased()) {
					return interaction.reply({
						content: 'This command can only be used in text channels.',
						flags: MessageFlags.Ephemeral
					});
				}

				// Check bot perms
				if (!channel
					.permissionsFor(interaction.client.user)
					.has(PermissionFlagsBits.ManageWebhooks)
				) {
					return interaction.reply({
						content: 'I need **Manage Webhooks** permission.',
						flags: MessageFlags.Ephemeral
					});
				}

				//await interaction.deferReply({ ephemeral: true });

				let webhook = await checkExistingWebHookInChannel(interaction);
				//console.log(webhook)

				// If none found, create one
				if (!webhook) {
					webhook = await channel.createWebhook({
						name: 'Sra. Lin Po\'poh',
						avatar: "https://api.japabets.pt/img/avatars/linpopoh.png",
					}).catch(e => console.error(e))
				}

				const target = interaction.options.getUser("member");
				const op = interaction.options.getString("japabetsmsg");
				let MSG;

				if (op == "konnichiwa")
					MSG = `Konnichiwa ${target}-san,

Agradecemos a sua confiança na JapaBets.

Assim que efetuar o depósito do valor pretendido para o **IBAN: ALTF4690517**, o montante será devidamente creditado na sua conta no site JapaBets.
(Na descrição coloque o seu nome, de forma a facilitar o processo)

Caso tenha alguma dúvida ou necessite de esclarecimentos adicionais, estamos totalmente disponíveis para o ajudar através do canal <#1449925819068580032> 

Acesso ao Website [JapaBets.pt](https://japabets.pt/)   ⬅️  LINK
		`

				if (op == "konnichiwa2")
					MSG = `
				Konnichiwa ${target}-san,

Agradecemos a sua confiança na JapaBets.

Informamos que o valor minimo de depósito é de $2500.

Assim que efetuar o depósito do valor pretendido para o IBAN: **ALTF4690517**, o montante será devidamente creditado na sua conta no site JapaBets. Isto pode ser feito atraves de um multibanco ou indo ao seu banco mais proximo, e efetua uma transferencia para o iban mencionado.
*(Assim que conclua a transferencia, envie o comprovativo de forma a agilizar o processo)*

Caso tenha alguma dúvida ou necessite de esclarecimentos adicionais, estamos totalmente disponíveis para o ajudar através do canal <#1449925819068580032>

Acesso ao Website [JapaBets.pt](https://japabets.pt/)   ⬅️  LINK`

				if (op == "receber")
					MSG = `Informamos que o valor depositado foi creditado com sucesso na sua conta JapaBets.

Agradecemos a sua preferência. Caso necessite de algum apoio adicional, estamos à sua disposição.

Para confirmar a receção desta mensagem, por favor reaja com o emote ✅.

Equipa JapaBets
||${target}||
		`
				if (op == "pagar")
					MSG = `Konnichiwa ${target}-sama,

Informamos que o seu pedido de levantamento foi recebido com sucesso.

Para darmos seguimento ao processo, solicitamos que nos envie o **IBAN da conta bancária** em seu nome para onde pretende que o valor seja transferido.

Após a confirmação do levantamento e validação dos dados, o montante será creditado no** prazo máximo de 24 horas**.

Caso tenha alguma dúvida ou necessite de apoio adicional, a nossa equipa encontra-se totalmente disponível através do canal <#1449925819068580032> 

Com os melhores cumprimentos,
**Equipa JapaBets**
		`

				if (op == "check")
					MSG = `Konnichiwa ${target}-sama,

Agradecemos que **verifique a correta receção do depósito**.

Para confirmação, solicitamos que reaja a esta mensagem com o emoji de correto (✅).

Caso identifique alguma** inconsistência ou necessite de apoio adicional**, a nossa equipa encontra-se à sua inteira disposição.

Com os melhores cumprimentos,
Equipa JapaBets
		`

				// Safety check
				if (!MSG) {
					console.error('Invalid operation:', op);
					return interaction.reply({
						content: 'Operação inválida!',
						flags: MessageFlags.Ephemeral
					});
				}

				//console.log(MSG);
				await webhook.send({
					content: MSG,
					//username: 'Webhook Bot',
					avatar: "https://api.japabets.pt/img/avatars/linpopoh.png",
				});

				return await interaction.reply({ content: `Enviado!`, flags: MessageFlags.Ephemeral });
				break;

			case 'recovery':
				const mongoose = require('mongoose');
				const { MONGO_URI_2 } = require("../../../config.json");
				/* let conn;
				try {
					conn = mongoose.createConnection(MONGO_URI_2);
					console.log('🔌 MongoDB connected');
				} catch (err) {
					console.error('❌ MongoDB connection error:', err);
					process.exit(1);
				}
				const db = conn.db;
				const users = db.collection('UsersBets');
				const username = interaction.options.getString("username");

				const user = await users.findOne({ username: username }); */
				const conn = mongoose.createConnection(MONGO_URI_2);
				conn.once('open', async () => {
					console.log('🔌 MongoDB connected');

					const db = conn.db; // ✅ now it's defined
					const users = db.collection('usersbets');

					const username = interaction.options.getString("username");
					const user = await users.findOne({ username: username });

					if (!user) {
						await conn.close();
						return interaction.reply({ content: `User with username: \`${username}\` not found!`, flags: MessageFlags.Ephemeral });
					}

					const crypto = require("crypto");
					const code = crypto.randomBytes(21).toString('hex'); // 42 chars
					await users.updateOne(
						{ username },
						{ $set: { recoveryCode: code } }
					);
					await conn.close();
					console.log('🔌 MongoDB connection closed');

					return interaction.reply({ content: `https://japabets.pt/${code}` });
				});

				break;
			default:
				break;

		}
	}
};