const color = require('colors');
const express = require('express');
const app = express();
const port = process.env.PORT || 80

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	res.setHeader('Access-Control-Allow-Credentials', 'true');

	next();
});

app.options('*', (req, res) => res.status(200).json());

module.exports.load = (client) => {
	app.use(express.json());

	app.get("/membercount/:id", (req, res) => require("./membercount.js")(req, res, client));
	app.get("/servercount/", (req, res) => require("./servercount.js")(req, res, client));
	app.post("/votes", (req, res) => require("./votes.js")(req, res, client));
	app.listen(port)
	console.log(`🚀 ${client.user.username} API is Up and Running!`.brightYellow.bold);
}

/* app.use(express.json());

app.get('/api/membercount/:id', (req, res) => {

	const { id } = req.params;

	res.status(200).send({
		membercount: func
	})

})

app.get('/tshirt', (req, res) => {
	res.status(200).send({
		tshirt: "ss",
		size: "large"
	})
})

app.post('/tshirt/:id', (req, res) => {

	const { id } = req.params;
	const { logo } = req.body;

	if (!logo)
		res.status(418).send({ message: "We need a logo!" });

	res.send({
		tshirt: `tshirt with your ${logo} and ID of ${id}`
	})
}) */