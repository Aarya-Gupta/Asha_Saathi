import React from 'react';

// A simple loading spinner component to show during API calls
function Loader() {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p className="loader-text">रिपोर्ट पढ़ी जा रही है...</p>
      <p className="instructions">(इसमें 30 सेकंड तक लग सकते हैं)</p>
    </div>
  );
}

export default Loader;