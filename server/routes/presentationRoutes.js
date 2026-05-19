const express = require('express');
const router = express.Router();
const {
  generatePresentation,
  getPresentations,
  getPresentationById,
  updatePresentation,
  deletePresentation,
  downloadPresentation,
} = require('../controllers/presentationController');

router.post('/generate', generatePresentation);
router.get('/', getPresentations);
router.get('/:id', getPresentationById);
router.put('/:id', updatePresentation);
router.delete('/:id', deletePresentation);
router.get('/:id/download', downloadPresentation);

module.exports = router;
