import React from 'react';

// This component receives an error message and a retry function as props
function ErrorComponent({ message, onRetry }) {
  return (
    <div className="error-container">
      <h3>कुछ गलत हो गया!</h3>
      <p>{message || 'An unexpected error occurred. Please try again.'}</p>
      <button onClick={onRetry} className="retry-button">
        फिर से कोशिश करें
      </button>
    </div>
  );
}

export default ErrorComponent;