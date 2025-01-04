const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  pdf: {
    type: String,
    required: false,
  },
  disability: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Disability', // الإشارة إلى مجموعة `Disability`
    required: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
  isOther: {
    type: Boolean,
    default: false,
  },
  otherDisabilities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Disability', // إشارة إلى `Disability` لعلاقة متعددة
    },
  ],
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
