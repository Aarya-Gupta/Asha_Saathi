import React from 'react';
import { languages } from '../translations'; // Import our languages list

function LanguageSelector({ onSelectLanguage }) {
  return (
    <div className="language-selector-container">
      <h2>Please select your language</h2>
      <h3>कृपया अपनी भाषा चुनें</h3>
      <div className="language-buttons">
        {languages.map((lang) => (
          <button
            key={lang.code}
            className="language-button"
            onClick={() => onSelectLanguage(lang.code)}
          >
            {lang.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default LanguageSelector;