import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import GenerateForm from '../components/GenerateForm';
import LoadingIndicator from '../components/LoadingIndicator';
import SlidePreview from '../components/SlidePreview';
import { generatePresentation, updatePresentation, getDownloadUrl } from '../services/api';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [presentation, setPresentation] = useState(null);
  const [slides, setSlides] = useState([]);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async (payload) => {
    setLoading(true);
    setPresentation(null);
    setSlides([]);
    setEditing(false);
    try {
      const data = await generatePresentation(payload);
      setPresentation(data.presentation);
      setSlides(data.presentation.slides);
      toast.success('Presentation generated!');
    } catch (err) {
      toast.error(err.message || 'Generation failed. Check your API keys.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdits = async () => {
    setSaving(true);
    try {
      const data = await updatePresentation(presentation._id, slides);
      setPresentation(data.presentation);
      setSlides(data.presentation.slides);
      setEditing(false);
      toast.success('Slides updated!');
    } catch {
      toast.error('Failed to save edits.');
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = () => {
    window.open(getDownloadUrl(presentation._id), '_blank');
  };

  return (
    <main>
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero__badge">✦ AI-Powered Presentations</div>
          <h1 className="hero__title">
            Turn any topic into a<br />
            <span>stunning presentation</span>
          </h1>
          <p className="hero__subtitle">
            Enter your topic, choose a tone, and let AI craft a professional
            PowerPoint in seconds.
          </p>
          <GenerateForm onGenerate={handleGenerate} loading={loading} />
        </div>
      </section>

      {/* Loading */}
      {loading && (
        <div className="container">
          <LoadingIndicator />
        </div>
      )}

      {/* Preview */}
      {!loading && presentation && (
        <section className="preview-section container">
          <div className="preview-section__header">
            <h2 className="preview-section__title">
              📊 {presentation.topic}
            </h2>
            <div className="preview-actions">
              {editing ? (
                <>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => { setSlides(presentation.slides); setEditing(false); }}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={handleSaveEdits}
                    disabled={saving}
                  >
                    {saving ? 'Saving…' : '💾 Save Changes'}
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setEditing(true)}
                  >
                    ✏️ Edit Slides
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => navigate('/history')}
                  >
                    📁 History
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={handleDownload}
                  >
                    ⬇️ Download PPT
                  </button>
                </>
              )}
            </div>
          </div>
          <SlidePreview
            slides={slides}
            editing={editing}
            onSlidesChange={setSlides}
          />
        </section>
      )}
    </main>
  );
}
