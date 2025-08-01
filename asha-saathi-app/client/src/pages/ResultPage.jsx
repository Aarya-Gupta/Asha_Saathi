import React from 'react';

// This component receives the full result data and a function to reset the app
function ResultPage({ resultData, onReset }) {
  const { analysis, audioContent } = resultData;

  // This function creates a playable audio object from the base64 string and plays it
  const playAudio = () => {
    // The browser can play audio directly from a base64 source string
    const audioSrc = `data:audio/mp3;base64,${audioContent}`;
    const audio = new Audio(audioSrc);
    audio.play();
  };

  // If for some reason analysis is not available, show a fallback.
  if (!analysis) {
    return (
      <div className="result-container">
        <h2>विश्लेषण लोड करने में विफल!</h2>
        <button onClick={onReset} className="reset-button">फिर से कोशिश करें</button>
      </div>
    );
  }

  return (
    <div className="result-container">
      <h2>रिपोर्ट का सारांश</h2>
      
      {/* Patient Name Section */}
      <div className="result-section">
        <h3>मरीज़ का नाम</h3>
        <p>{analysis.patient_name}</p>
      </div>

      {/* Summary Section */}
      <div className="result-section">
        <h3>मुख्य सारांश</h3>
        <p>{analysis.summary}</p>
      </div>

      {/* Audio Player Section */}
      <div className="result-section">
        <h3>ऑडियो सारांश सुनें</h3>
        <button onClick={playAudio} className="play-audio-button">
          {/* Simple SVG for a play icon */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
          ऑडियो चलाएं
        </button>
      </div>

      {/* Action Points Section */}
      <div className="result-section">
        <h3>अगले कदम (ASHA कार्यकर्ता के लिए)</h3>
        <ul className="action-list">
          {analysis.action_points.map((point, index) => (
            <li key={index} className="action-item">
              {point}
            </li>
          ))}
        </ul>
      </div>

      <button onClick={onReset} className="reset-button">
        दूसरी रिपोर्ट स्कैन करें
      </button>
    </div>
  );
}

export default ResultPage;