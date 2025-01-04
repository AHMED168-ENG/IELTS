const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  questionText: { type: String, required: true },
  type: {
    type: String,
    enum: ['multipleChoice', 'trueFalse', 'file', 'audio', "fillInTheBlank"],
    required: true
  },
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sections',
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
  },
  order: { type: Number },
  degree : { type: Number , default : 1 },
  choices: [{ type: String }],
  correctAnswer: { type: String },
  file: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
