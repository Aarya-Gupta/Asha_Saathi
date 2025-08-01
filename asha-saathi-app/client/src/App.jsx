import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Vite creates this, we can style later

function App() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Use the useEffect hook to fetch data from the backend when the component mounts
  useEffect(() => {
    // Fetch data from our backend.
    // Replace this URL with your actual backend server URL when deployed.
    axios.get('http://localhost:8080/')
      .then(response => {
        setMessage(response.data.message);
        setLoading(false);
      })
      .catch(error => {
        console.error("There was an error fetching data from the backend!", error);
        setMessage('Could not connect to the backend.');
        setLoading(false);
      });
  }, []); // The empty array ensures this effect runs only once

  return (
    <div className="App">
      <header className="App-header">
        <h1>ASHA Saathi</h1>
        <p>
          {loading ? 'Connecting to backend...' : message}
        </p>
      </header>
    </div>
  );
}

export default App;