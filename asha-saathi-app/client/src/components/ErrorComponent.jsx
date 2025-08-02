import React from 'react';

function ErrorComponent({ message, onReset, t, lang }) {
  return (
    <div className="error-container">
      <h3>{t.errorTitle[lang]}</h3>
      <p>{message || 'An unexpected error occurred.'}</p>
      <button onClick={onReset} className="retry-button">
        {t.retryButton[lang]}
      </button>
    </div>
  );
}

export default ErrorComponent;