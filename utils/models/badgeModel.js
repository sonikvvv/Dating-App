const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BadgeSchema = new Schema({
    title: String,
    description: String,
    image: 
        {
            url: String,
            filename: String,
        },
    
});

module.exports = mongoose.model('Badge', BadgeSchema);