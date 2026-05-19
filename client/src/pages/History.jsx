import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';
import { getPresentations, deletePresentation, getDownloadUrl } from '../services/api';

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });

export default function History() {
  const [presentations, setPresentations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getPresentations()
      .then((d) => setPresentations(d.presentations))
      .catch(() => toast.error('Failed to load history.'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    try {
      await deletePresentation(deleteTarget);
      setPresentations((prev) => prev.filter((p) => p._id !== deleteTarget));
      toast.success('Deleted successfully.');
    } catch {
      toast.error('Failed to delete.');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <main className="container">
      <div className="page-header">
        <h1 className="page-header__title">Presentation History</h1>
        <p className="page-header__sub">All your previously generated presentations.</p>
      </div>

      {loading ? (
        <div className="loading-overlay">
          <div className="spinner" />
        </div>
      ) : presentations.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">📂</div>
          <h3 className="empty-state__title">No presentations yet</h3>
          <p className="empty-state__sub">Generate your first one on the home page.</p>
          <button
            className="btn btn-primary"
            style={{ marginTop: 20 }}
            onClick={() => navigate('/')}
          >
            ✦ Generate Now
          </button>
        </div>
      ) : (
        <div className="history-grid">
          {presentations.map((p) => (
            <div key={p._id} className="history-card">
              <h3 className="history-card__topic" title={p.topic}>{p.topic}</h3>
              <div className="history-card__meta">
                <span className="history-card__badge">{p.tone}</span>
                <span>{p.slideCount} slides</span>
                <span>{formatDate(p.createdAt)}</span>
              </div>
              <div className="history-card__actions">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => navigate(`/presentation/${p._id}`)}
                >
                  👁 View
                </button>
                <a
                  href={getDownloadUrl(p._id)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary btn-sm"
                >
                  ⬇️ Download
                </a>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => setDeleteTarget(p._id)}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Delete Presentation"
          message="This will permanently delete the presentation and its file. Are you sure?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </main>
  );
}
