import React from 'react';

// --- MODIFIED: Now accepts t and lang as props ---
function ResultPage({ resultData, onReset, t, lang }) {
  const { analysis, audioContent } = resultData;

  const playAudio = () => {
    const audioSrc = `data:audio/mp3;base64,${audioContent}`;
    const audio = new Audio(audioSrc);
    audio.play();
  };

  if (!analysis) {
    return (
      <div className="result-container">
        {/* Make this dynamic too */}
        <h2>{t.errorTitle[lang]}</h2>
        <button onClick={onReset} className="reset-button">{t.retryButton[lang]}</button>
      </div>
    );
  }

  return (
    <div className="result-container">
      {/* --- ALL LABELS BELOW ARE NOW DYNAMIC --- */}
      <h2>{t.resultTitle[lang]}</h2>
      
      <div className="result-section">
        <h3>{t.patientNameLabel[lang]}</h3>
        <p>{analysis.patient_name}</p>
      </div>

      <div className="result-section">
        <h3>{t.summaryLabel[lang]}</h3>
        <p>{analysis.summary}</p>
      </div>

      <div className="result-section">
        <h3>{t.audioLabel[lang]}</h3>
        <button onClick={playAudio} className="play-audio-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
          {t.playAudioButton[lang]}
        </button>
      </div>

      <div className="result-section">
        <h3>{t.actionsLabel[lang]}</h3>
        <ul className="action-list">
          {analysis.action_points.map((point, index) => (
            <li key={index} className="action-item">
              {point}
            </li>
          ))}
        </ul>
      </div>

      <button onClick={onReset} className="reset-button">
        {t.scanAnotherButton[lang]}
      </button>
    </div>
  );
}

export default ResultPage;