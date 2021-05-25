const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Message = require("./messageModel");

const ChatSchema = new Schema({
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
});

ChatSchema.post("findByIdAndDelete", async function (doc) {
    if (doc) {
        doc.messages.forEach((message) => {
            await Message.findByIdAndDelete(message._id);
        });
    }
});

module.exports = mongoose.model('Chat', ChatSchema);
