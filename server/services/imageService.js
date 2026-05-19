const axios = require('axios');

/**
 * Fetches a relevant image URL from Pexels for a given query.
 * Falls back to a placeholder if the API call fails.
 */
const fetchImage = async (query) => {
  try {
    const response = await axios.get('https://api.pexels.com/v1/search', {
      headers: { Authorization: process.env.PEXELS_API_KEY },
      params: { query, per_page: 1, orientation: 'landscape' },
    });
    const photo = response.data.photos?.[0];
    return photo ? photo.src.large : getFallback(query);
  } catch {
    return getFallback(query);
  }
};

const getFallback = (query) =>
  `https://source.unsplash.com/800x450/?${encodeURIComponent(query)}`;

/**
 * Fetches images for all slides in parallel.
 */
const fetchImagesForSlides = async (slides) => {
  return Promise.all(
    slides.map((slide) => fetchImage(slide.title))
  );
};

module.exports = { fetchImagesForSlides };
