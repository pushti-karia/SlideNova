const axios = require('axios');

/**
 * Calls Groq API to generate structured slide content for a given topic.
 * Returns an array of slide objects: { title, bullets }
 */
const generateSlideContent = async (topic, tone, slideCount) => {
  const toneDescriptions = {
    professional: 'formal, concise, and business-oriented',
    educational: 'informative, clear, and teaching-focused',
    corporate: 'strategic, data-driven, and executive-level',
    'beginner-friendly': 'simple, approachable, and easy to understand',
  };

  const prompt = `You are a professional presentation designer. Generate a structured PowerPoint presentation on the topic: "${topic}".

Tone: ${toneDescriptions[tone] || toneDescriptions['professional']}
Total slides: ${slideCount} (including title and conclusion)

Return ONLY a valid JSON array with exactly ${slideCount} slide objects. No markdown, no explanation, no code fences.
Each object must have:
- "title": short slide heading (max 8 words)
- "bullets": array of 4-5 concise bullet points (max 15 words each)

The first slide must be the title/intro slide.
The last slide must be a conclusion/summary slide.
Middle slides cover key aspects of the topic.

Example:
[
  { "title": "Introduction to Topic", "bullets": ["Point one", "Point two", "Point three", "Point four"] }
]`;

  const response = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2048,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const rawText = response.data.choices[0]?.message?.content || '';
  const jsonText = rawText.replace(/```json|```/g, '').trim();
  const slides = JSON.parse(jsonText);

  if (!Array.isArray(slides)) throw new Error('AI did not return an array');
  return slides;
};

module.exports = { generateSlideContent };
