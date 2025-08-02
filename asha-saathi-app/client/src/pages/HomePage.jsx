import React from 'react';

function HomePage({ handleFileSelect, isLoading, t, lang }) {
  const onFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      handleFileSelect(event.target.files[0]);
    }
  };

  return (
    <div className="app-main">
      <h2>{t.uploadHeader[lang]}</h2>
      <p className="instructions">{t.uploadInstruction[lang]}</p>
      <label htmlFor="report-upload" className="upload-label">
        {t.chooseFile[lang]}
      </label>
      <input
        id="report-upload"
        type="file"
        accept="image/*"
        className="upload-input"
        onChange={onFileChange}
        disabled={isLoading}
      />
    </div>
  );
}

export default HomePage;