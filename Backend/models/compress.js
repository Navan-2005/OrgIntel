const mongoose = require("mongoose");

const CompressionSchema = new mongoose.Schema({
  binary: {
    type: String,
    required: true
  },
  tree: Object,
  userId: String,
  originalText: String,
}, { timestamps: true });

const Compression= mongoose.model("Compression", CompressionSchema);

module.exports = Compression;
