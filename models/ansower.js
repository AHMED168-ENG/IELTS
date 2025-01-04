const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const answerSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },  // المرجعية للمستخدم
  examId: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },  // المرجعية للاختبار
  answers: [
    { 
      questionId: { type: Schema.Types.ObjectId, ref: 'Question' },  // المرجعية للسؤال
      answer: String,  // الإجابة النصية
      audioFile: String,  // إذا كانت الإجابة عبارة عن ملف صوتي
      fileFile: String,  // إذا كانت الإجابة عبارة عن ملف
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Answer = mongoose.model('Answer', answerSchema);
module.exports = Answer;
