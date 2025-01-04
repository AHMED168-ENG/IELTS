const mongoose = require("mongoose");

const disabilitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
    }
  },
  {
    timestamps: true,
  }
);

const Disability = mongoose.model("userJoinExam", disabilitySchema);
module.exports = Disability;
