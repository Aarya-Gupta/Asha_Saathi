import React, { useState } from 'react';
import axios from 'axios'; // Import axios
import './App.css';
import HomePage from './pages/HomePage';
import Loader from './components/Loader';
import ErrorComponent from './components/ErrorComponent'; // Import the new component
import ResultPage from './pages/ResultPage'; // Import the new ResultPage

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [error, setError] = useState(''); // New state for error messages

  // This is the main function to handle the API call
  const handleFileSelect = async (file) => {
    if (!file) return;
    
    setSelectedFile(file);
    setIsLoading(true);
    setError(''); // Reset previous errors
    setResultData(null); // Reset previous results

    // FormData is the standard way to send files to a server
    const formData = new FormData();
    formData.append('reportImage', file); // The key "reportImage" must match our backend

    try {
      // Make the POST request to our backend
      const response = await axios.post('http://localhost:8080/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log("API Response Received:", response.data);
      setResultData(response.data); // Store the successful response

    } catch (err) {
      console.error("API call failed:", err);
      // Set a user-friendly error message
      const errorMessage = err.response?.data?.error || 'सर्वर से कनेक्ट नहीं हो सका।';
      setError(errorMessage);
    } finally {
      // This will run whether the API call succeeds or fails
      setIsLoading(false);
    }
  };

  // A function to reset the app state and try again
  const handleRetry = () => {
    setSelectedFile(null);
    setIsLoading(false);
    setResultData(null);
    setError('');
  };

  // Helper function to decide what to render
  const renderContent = () => {
    if (isLoading) {
      return <Loader />;
    }
    if (error) {
      return <ErrorComponent message={error} onRetry={handleRetry} />;
    }
    if (resultData) {
      return <ResultPage resultData={resultData} onReset={handleRetry} />;
    }
    return <HomePage handleFileSelect={handleFileSelect} isLoading={isLoading} />;
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>आशा सारथी</h1>
        <p>1-Click Health Summary</p>
      </header>
      {renderContent()}
    </div>
  );
}

export default App;