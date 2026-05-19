const Presentation = require('../models/Presentation');
const { generateSlideContent } = require('../services/aiService');
const { fetchImagesForSlides } = require('../services/imageService');
const { buildPptx } = require('../services/pptService');
const path = require('path');
const fs = require('fs');

/**
 * POST /api/presentations/generate
 * Generates a presentation using AI, fetches images, builds PPTX, saves to DB.
 */
const generatePresentation = async (req, res) => {
  try {
    const { topic, tone = 'professional', slideCount = 6 } = req.body;

    if (!topic || topic.trim().length < 3) {
      return res.status(400).json({ error: 'Topic must be at least 3 characters.' });
    }

    const count = Math.min(Math.max(parseInt(slideCount), 5), 7);

    // 1. Generate slide content via AI
    const rawSlides = await generateSlideContent(topic.trim(), tone, count);

    // 2. Fetch images for each slide
    const imageUrls = await fetchImagesForSlides(rawSlides);
    const slides = rawSlides.map((s, i) => ({ ...s, imageUrl: imageUrls[i] || '' }));

    // 3. Build PPTX file
    const fileName = `slidenova_${Date.now()}.pptx`;
    await buildPptx(topic.trim(), slides, fileName);

    // 4. Save to MongoDB
    const presentation = await Presentation.create({
      topic: topic.trim(),
      tone,
      slideCount: count,
      slides,
      filePath: `downloads/${fileName}`,
      fileName,
    });

    res.status(201).json({ presentation });
  } catch (err) {
    console.error('Generate error:', err.message);
    res.status(500).json({ error: err.message || 'Failed to generate presentation.' });
  }
};

/**
 * GET /api/presentations
 * Returns all saved presentations, newest first.
 */
const getPresentations = async (req, res) => {
  try {
    const presentations = await Presentation.find()
      .sort({ createdAt: -1 })
      .select('-slides');
    res.json({ presentations });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch presentations.' });
  }
};

/**
 * GET /api/presentations/:id
 * Returns a single presentation with full slide data.
 */
const getPresentationById = async (req, res) => {
  try {
    const presentation = await Presentation.findById(req.params.id);
    if (!presentation) return res.status(404).json({ error: 'Not found.' });
    res.json({ presentation });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch presentation.' });
  }
};

/**
 * PUT /api/presentations/:id
 * Updates slide content (for editable slides feature).
 */
const updatePresentation = async (req, res) => {
  try {
    const { slides } = req.body;
    const presentation = await Presentation.findById(req.params.id);
    if (!presentation) return res.status(404).json({ error: 'Not found.' });

    presentation.slides = slides;
    await presentation.save();

    // Rebuild PPTX with updated slides
    await buildPptx(presentation.topic, slides, presentation.fileName);

    res.json({ presentation });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update presentation.' });
  }
};

/**
 * DELETE /api/presentations/:id
 * Deletes a presentation from DB and removes the PPTX file.
 */
const deletePresentation = async (req, res) => {
  try {
    const presentation = await Presentation.findByIdAndDelete(req.params.id);
    if (!presentation) return res.status(404).json({ error: 'Not found.' });

    // Remove file from disk
    const filePath = path.join(__dirname, '..', presentation.filePath);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.json({ message: 'Deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete presentation.' });
  }
};

/**
 * GET /api/presentations/:id/download
 * Streams the PPTX file to the client.
 */
const downloadPresentation = async (req, res) => {
  try {
    const presentation = await Presentation.findById(req.params.id);
    if (!presentation) return res.status(404).json({ error: 'Not found.' });

    const filePath = path.join(__dirname, '..', presentation.filePath);
    if (!fs.existsSync(filePath))
      return res.status(404).json({ error: 'File not found on server.' });

    res.download(filePath, presentation.fileName);
  } catch (err) {
    res.status(500).json({ error: 'Failed to download.' });
  }
};

module.exports = {
  generatePresentation,
  getPresentations,
  getPresentationById,
  updatePresentation,
  deletePresentation,
  downloadPresentation,
};
