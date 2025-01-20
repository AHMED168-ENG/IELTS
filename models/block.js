const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blockSchema = new Schema({
    description: {
        type: String,
        required: true,
        trim: true // لإزالة المسافات الزائدة من بداية ونهاية النص
    },
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        required: true
    },
    section: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sections',
    },
    order: {
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
});



const Block = mongoose.model('Block', blockSchema);
module.exports = Block;
