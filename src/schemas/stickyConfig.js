const { Schema, model } = require('mongoose')

const stickyConfig = new Schema({
    userId: String,
    guildId: String,
    roles: {
        type: [String],
        default: []
    }
})

module.exports = model('stickyConfig', stickyConfig)