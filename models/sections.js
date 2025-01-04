const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sectionSchema = new Schema({
  section: { type: String, enum: ['reading', 'writing', 'listening', 'speaking'], required: true },
  duration: { type: Number, required: true },  
  // startTime: { type: Date },
  // endTime: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const SectionSchema = mongoose.model('Sections', sectionSchema);
module.exports = SectionSchema;
