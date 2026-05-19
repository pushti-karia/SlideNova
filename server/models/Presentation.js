const mongoose = require('mongoose');

const slideSchema = new mongoose.Schema({
  title: { type: String, required: true },
  bullets: [{ type: String }],
  imageUrl: { type: String, default: '' },
});

const presentationSchema = new mongoose.Schema(
  {
    topic: { type: String, required: true },
    tone: {
      type: String,
      enum: ['professional', 'educational', 'corporate', 'beginner-friendly'],
      default: 'professional',
    },
    slideCount: { type: Number, default: 6 },
    slides: [slideSchema],
    filePath: { type: String, default: '' },
    fileName: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Presentation', presentationSchema);
