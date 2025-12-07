import mongoose from "mongoose";

const SentMailSchema = new mongoose.Schema({
  messageId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  rfpId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RFP",
    required: true
  },

  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true
  },

  recipients: {
    type: [String],  
    default: []
  },

  sentAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("SentMail", SentMailSchema);
