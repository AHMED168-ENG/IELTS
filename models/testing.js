const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const examSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['academic', 'general training'], required: true },
  shuffle: {
    type: Boolean,
    required: true,
    default: true
  },
  code: { type: Number, required: true },
  active: { type: Boolean, required: true, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

examSchema.pre('validate', async function (next) {
  try {
    if (this.isNew) {
      const lastExam = await mongoose.model('Exam').findOne().sort({ code: -1 });
      this.code = lastExam ? lastExam.code + 1 : 1; // إذا لم يوجد كود، يبدأ من 1
    }
    next();
  } catch (error) {
    next(error);
  }
});


const Exam = mongoose.model('Exam', examSchema);
module.exports = Exam;
