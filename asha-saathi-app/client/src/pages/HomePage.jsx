import React from 'react';

// The props `handleFileSelect` and `isLoading` will be passed down from App.jsx
function HomePage({ handleFileSelect, isLoading }) {
  
  // This function is triggered when the user chooses a file
  const onFileChange = (event) => {
    // Check if files were selected
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      handleFileSelect(file); // Pass the selected file up to the parent
    }
  };

  return (
    <div className="app-main">
      <h2>रिपोर्ट अपलोड करें</h2>
      <p className="instructions">
        मेडिकल रिपोर्ट की एक साफ़ तस्वीर चुनें।
      </p>
      
      {/* 
        This is a common pattern for file uploads. The <input> is hidden,
        and the <label> acts as our custom, styled button.
      */}
      <label htmlFor="report-upload" className="upload-label">
        फ़ाइल चुनें
      </label>
      <input 
        id="report-upload"
        type="file" 
        accept="image/*" // Accept only image files
        className="upload-input"
        onChange={onFileChange}
        disabled={isLoading} // Disable button while loading
      />
    </div>
  );
}

export default HomePage;