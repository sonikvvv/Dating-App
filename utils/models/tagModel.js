const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TagSchema = new Schema({
    title: String
});

module.exports = mongoose.model('Tag', TagSchema);