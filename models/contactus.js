const mongoose = require("mongoose");

const contactUsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Assuming userId references the `users` collection
      ref: "User", // Reference to the User model
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create the model
const ContactUs = mongoose.model("ContactUs", contactUsSchema);

module.exports = ContactUs;



// iam using windows os and VS code as an ide and mysqlas database , you are expert developer  write ielts exam semulation app for me and guide me all the way to complete this project 
