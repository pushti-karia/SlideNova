import React, { useState } from 'react';

const TONES = [
  { value: 'professional', label: 'Professional', icon: '💼' },
  { value: 'educational', label: 'Educational', icon: '📚' },
  { value: 'corporate', label: 'Corporate', icon: '🏢' },
  { value: 'beginner-friendly', label: 'Beginner', icon: '🌱' },
];

export default function GenerateForm({ onGenerate, loading }) {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('professional');
  const [slideCount, setSlideCount] = useState(6);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (topic.trim().length < 3) {
      setError('Please enter a topic with at least 3 characters.');
      return;
    }
    setError('');
    onGenerate({ topic: topic.trim(), tone, slideCount });
  };

  return (
    <div className="form-card">
      <form onSubmit={handleSubmit} noValidate>
        {/* Topic */}
        <div className="form-group">
          <label className="form-label" htmlFor="topic">
            Presentation Topic *
          </label>
          <input
            id="topic"
            type="text"
            className={`form-input${error ? ' error' : ''}`}
            placeholder="e.g. The Future of Artificial Intelligence"
            value={topic}
            onChange={(e) => { setTopic(e.target.value); setError(''); }}
            disabled={loading}
            maxLength={120}
          />
          {error && <p className="form-error">{error}</p>}
          <p className="form-hint">{topic.length}/120 characters</p>
        </div>

        {/* Tone */}
        <div className="form-group">
          <label className="form-label">Presentation Tone</label>
          <div className="tone-grid">
            {TONES.map((t) => (
              <React.Fragment key={t.value}>
                <input
                  type="radio"
                  id={`tone-${t.value}`}
                  name="tone"
                  value={t.value}
                  className="tone-option"
                  checked={tone === t.value}
                  onChange={() => setTone(t.value)}
                  disabled={loading}
                />
                <label htmlFor={`tone-${t.value}`} className="tone-label">
                  <span className="tone-icon">{t.icon}</span>
                  {t.label}
                </label>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Slide count */}
        <div className="form-group">
          <label className="form-label" htmlFor="slideCount">
            Number of Slides: <strong>{slideCount}</strong>
          </label>
          <input
            id="slideCount"
            type="range"
            min={5} max={7} step={1}
            value={slideCount}
            onChange={(e) => setSlideCount(Number(e.target.value))}
            disabled={loading}
            style={{ width: '100%', accentColor: 'var(--accent)' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {[5, 6, 7].map((n) => (
              <span key={n} className="form-hint">{n}</span>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-lg"
          style={{ width: '100%', marginTop: 8 }}
          disabled={loading}
        >
          {loading ? '⏳ Generating…' : '✦ Generate Presentation'}
        </button>
      </form>
    </div>
  );
}
