const mongoose = require('mongoose');

const usersResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  Exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Testing', 
    required: true,
  },
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sections', 
    required: true,
  },
  degree: {
    type: Number,
    required: true,
  },
  degreeFrom : {
    type: Number,
    required: true,
  }
} , {timestamps : true});

const UsersResult = mongoose.model('UsersResult', usersResultSchema);
module.exports = UsersResult;
