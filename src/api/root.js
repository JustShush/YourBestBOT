/**
 * @typedef {import('express').Response} CustomResponse
 * @param {CustomResponse} res
 */
module.exports = (res) => {

	res.status(200).redirect('https://yourbestbot.pt')
}