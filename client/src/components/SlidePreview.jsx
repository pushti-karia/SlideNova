import React from 'react';

function EditableSlide({ slide, index, onChange }) {
  const updateTitle = (val) => onChange({ ...slide, title: val });
  const updateBullet = (i, val) => {
    const bullets = [...slide.bullets];
    bullets[i] = val;
    onChange({ ...slide, bullets });
  };
  const removeBullet = (i) =>
    onChange({ ...slide, bullets: slide.bullets.filter((_, idx) => idx !== i) });
  const addBullet = () =>
    onChange({ ...slide, bullets: [...slide.bullets, ''] });

  return (
    <div className="slide-card slide-card--editing">
      {slide.imageUrl ? (
        <img src={slide.imageUrl} alt={slide.title} className="slide-card__img" />
      ) : (
        <div className="slide-card__img-placeholder">🖼️</div>
      )}
      <div className="slide-card__body">
        <p className="slide-card__num">Slide {index + 1}</p>
        <input
          className="edit-input"
          value={slide.title}
          onChange={(e) => updateTitle(e.target.value)}
          placeholder="Slide title"
        />
        {slide.bullets.map((b, i) => (
          <div key={i} className="edit-bullet">
            <input
              className="edit-input"
              style={{ marginBottom: 0 }}
              value={b}
              onChange={(e) => updateBullet(i, e.target.value)}
              placeholder={`Bullet ${i + 1}`}
            />
            <button
              className="edit-bullet-remove"
              onClick={() => removeBullet(i)}
              title="Remove bullet"
            >
              ×
            </button>
          </div>
        ))}
        {slide.bullets.length < 6 && (
          <button className="edit-add-bullet" onClick={addBullet}>
            + Add bullet
          </button>
        )}
      </div>
    </div>
  );
}

function ReadonlySlide({ slide, index }) {
  return (
    <div className="slide-card">
      {slide.imageUrl ? (
        <img src={slide.imageUrl} alt={slide.title} className="slide-card__img" />
      ) : (
        <div className="slide-card__img-placeholder">🖼️</div>
      )}
      <div className="slide-card__body">
        <p className="slide-card__num">Slide {index + 1}</p>
        <h3 className="slide-card__title">{slide.title}</h3>
        <ul className="slide-card__bullets">
          {slide.bullets.map((b, i) => <li key={i}>{b}</li>)}
        </ul>
      </div>
    </div>
  );
}

export default function SlidePreview({ slides, editing, onSlidesChange }) {
  if (!slides?.length) return null;

  return (
    <div className="slides-grid">
      {slides.map((slide, i) =>
        editing ? (
          <EditableSlide
            key={i}
            slide={slide}
            index={i}
            onChange={(updated) => {
              const next = [...slides];
              next[i] = updated;
              onSlidesChange(next);
            }}
          />
        ) : (
          <ReadonlySlide key={i} slide={slide} index={i} />
        )
      )}
    </div>
  );
}
