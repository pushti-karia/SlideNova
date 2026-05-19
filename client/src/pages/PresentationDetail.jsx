import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import SlidePreview from '../components/SlidePreview';
import { getPresentationById, updatePresentation, getDownloadUrl } from '../services/api';

export default function PresentationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [presentation, setPresentation] = useState(null);
  const [slides, setSlides] = useState([]);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPresentationById(id)
      .then((d) => { setPresentation(d.presentation); setSlides(d.presentation.slides); })
      .catch(() => toast.error('Failed to load presentation.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = await updatePresentation(id, slides);
      setPresentation(data.presentation);
      setSlides(data.presentation.slides);
      setEditing(false);
      toast.success('Slides updated!');
    } catch {
      toast.error('Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-overlay container"><div className="spinner" /></div>;
  if (!presentation) return <div className="container empty-state"><p>Presentation not found.</p></div>;

  return (
    <main className="container">
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/history')} style={{ marginBottom: 12 }}>
            ← Back
          </button>
          <h1 className="page-header__title">{presentation.topic}</h1>
          <p className="page-header__sub" style={{ textTransform: 'capitalize' }}>
            {presentation.tone} · {presentation.slideCount} slides
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          {editing ? (
            <>
              <button className="btn btn-secondary btn-sm" onClick={() => { setSlides(presentation.slides); setEditing(false); }} disabled={saving}>Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : '💾 Save'}</button>
            </>
          ) : (
            <>
              <button className="btn btn-secondary btn-sm" onClick={() => setEditing(true)}>✏️ Edit</button>
              <a href={getDownloadUrl(id)} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">⬇️ Download PPT</a>
            </>
          )}
        </div>
      </div>

      <SlidePreview slides={slides} editing={editing} onSlidesChange={setSlides} />
    </main>
  );
}
