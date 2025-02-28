const mongoose = require("mongoose");

const CapsuleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  text: { type: String, required: true },
  imageUrl: { type: String },
  openAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Method to check if the capsule can be open
CapsuleSchema.methods.isOpen = function() {
  return new Date() >= this.openAt;
};

module.exports = mongoose.model("Capsule", CapsuleSchema);
