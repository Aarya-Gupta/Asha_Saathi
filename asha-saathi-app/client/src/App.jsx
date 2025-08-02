import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

import HomePage from './pages/HomePage';
import Loader from './components/Loader';
import ErrorComponent from './components/ErrorComponent';
import ResultPage from './pages/ResultPage';
import LanguageSelector from './components/LanguageSelector';

import { translations as t } from './translations';

function App() {
  const [language, setLanguage]     = useState(null);
  const [isLoading, setIsLoading]   = useState(false);
  const [resultData, setResultData] = useState(null);
  const [error, setError]           = useState('');

  const handleSelectLanguage = (langCode) => {
    setLanguage(langCode);
  };

  const handleFileSelect = async (file) => {
    if (!file || !language) return;

    setIsLoading(true);
    setError('');
    setResultData(null);

    const formData = new FormData();
    formData.append('reportImage', file);
    formData.append('language', language);

    try {
      const apiUrl  = 'http://localhost:8080/api/upload';
      const response = await axios.post(apiUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      console.log("API Response Received:", response.data);
      setResultData(response.data);
    } catch (err) {
      console.error("API call failed:", err);
      const fallbackMsg = {
        en: 'Could not connect to server.',
        hi: 'सर्वर से कनेक्ट नहीं हो सका।'
      }[language] || 'Server error.';
      setError(err.response?.data?.error || fallbackMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResultData(null);
    setError('');
  };

  const renderContent = () => {
    if (!language) {
      return <LanguageSelector onSelectLanguage={handleSelectLanguage} />;
    }
    if (isLoading) {
      return <Loader t={t} lang={language} />;
    }
    if (error) {
      return <ErrorComponent
        message={error}
        onReset={handleReset}
        t={t}
        lang={language}
      />;
    }
    if (resultData) {
      // Pass translation and language into ResultPage
      return <ResultPage
        resultData={resultData}
        onReset={handleReset}
        t={t}
        lang={language}
      />;
    }
    return <HomePage
      handleFileSelect={handleFileSelect}
      isLoading={isLoading}
      t={t}
      lang={language}
    />;
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>{t.appTitle[language || 'en']}</h1>
        <p>{t.appSubtitle[language || 'en']}</p>
      </header>
      {renderContent()}
    </div>
  );
}

export default App;
