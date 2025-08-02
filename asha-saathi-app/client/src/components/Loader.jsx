import React from 'react';

function Loader({ t, lang }) { // Receive t (translations) and lang (language)
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p className="loader-text">{t.loaderText[lang]}</p>
      <p className="instructions">{t.loaderTime[lang]}</p>
    </div>
  );
}

export default Loader;