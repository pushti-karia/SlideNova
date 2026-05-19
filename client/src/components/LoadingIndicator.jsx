import React, { useEffect, useState } from 'react';

const STEPS = [
  'Connecting to AI…',
  'Generating slide content…',
  'Fetching images…',
  'Building your presentation…',
  'Almost done…',
];

export default function LoadingIndicator() {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(8);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => {
        const next = Math.min(s + 1, STEPS.length - 1);
        setProgress(Math.min(((next + 1) / STEPS.length) * 90, 90));
        return next;
      });
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-overlay">
      <div className="spinner" />
      <p className="loading-text">{STEPS[step]}</p>
      <div className="progress-bar-wrap">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
