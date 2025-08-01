// Import required packages
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const multer = require('multer');

// --- NEW: Import DB connection and Model ---
const connectDB = require('./config/db');
const Report = require('./models/Report');

// --- Google Cloud/AI Clients ---
const { ImageAnnotatorClient } = require('@google-cloud/vision');
const { TextToSpeechClient } = require('@google-cloud/text-to-speech'); // Import TTS Client
const { GoogleGenerativeAI } = require("@google/generative-ai"); // Import Gemini Client

// --- NEW: Connect to Database ---
connectDB();

// --- Initialize Clients ---
const visionClient = new ImageAnnotatorClient(); // For OCR
const textToSpeechClient = new TextToSpeechClient(); // For TTS
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // For GenAI

// Initialize the Express app
const app = express();

// Multer Configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- API Routes ---

// Root route
app.get('/', (req, res) => {
  res.status(200).json({ message: "Hello from ASHA Saathi Backend!" });
});

// The main analysis route
app.post('/api/upload', upload.single('reportImage'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded. Please select a file." });
  }

  try {
    // --- STAGE 3: OCR ---
    console.log('1. Starting OCR process...');
    const [result] = await visionClient.textDetection(req.file.buffer);
    const extractedText = result.fullTextAnnotation?.text;

    if (!extractedText) {
      console.log('No text found in image.');
      return res.status(400).json({ error: 'No text could be extracted from the image.' });
    }
    console.log('1. OCR Process Completed.');

    // --- STAGE 4: GenAI Analysis ---
    console.log('2. Starting GenAI analysis...');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const prompt = `You are an expert medical assistant for an Indian ASHA health worker. Analyze the following medical report text extracted via OCR. Your task is to provide a response in a clean JSON format. The entire JSON output, including keys and values, must be in simple, conversational Hindi (written in Devanagari script). The JSON should have three keys: "patient_name", "summary", and "action_points". The summary should be a simple, one or two-sentence explanation. The action points should be an array of 2-3 clear, actionable steps for the ASHA worker. Medical Text: "${extractedText}"`;
    
    const aiResult = await model.generateContent(prompt);
    const aiResponse = await aiResult.response;
    let aiResponseText = aiResponse.text();
    
    // Clean up the response to ensure it's valid JSON
    aiResponseText = aiResponseText.replace(/```json/g, '').replace(/```/g, '').trim();
    console.log('2. GenAI Analysis Completed.');

    const analysisResult = JSON.parse(aiResponseText);
    const hindiSummary = analysisResult.summary;

    if (!hindiSummary) {
        throw new Error("AI model did not return a summary.");
    }

    // --- STAGE 4: Text-to-Speech ---
    console.log('3. Starting Text-to-Speech conversion...');
    const ttsRequest = {
      input: { text: hindiSummary },
      voice: { languageCode: 'hi-IN', name: 'hi-IN-Wavenet-D' }, // A good quality Hindi voice
      audioConfig: { audioEncoding: 'MP3' },
    };

    const [ttsResponse] = await textToSpeechClient.synthesizeSpeech(ttsRequest);
    const audioContent = ttsResponse.audioContent.toString('base64'); // Convert audio to base64 to send in JSON
    console.log('3. TTS Conversion Completed.');

    // --- NEW: STAGE 5 - Save to Database ---
    console.log('5. Saving analysis to database...');
    const newReport = new Report({
        patientName: analysisResult.patient_name,
        summary: analysisResult.summary,
        actionPoints: analysisResult.action_points,
        originalText: extractedText
    });
    await newReport.save();
    console.log('5. Analysis saved successfully.');

    // --- Final Response ---
    console.log('4. Sending final structured response.');
    res.status(200).json({
      message: "File processed successfully!",
      analysis: analysisResult, // The structured JSON from Gemini
      audioContent: audioContent, // The base64 encoded audio
    });

  } catch (error) {
    console.error('ERROR during AI pipeline:', error);
    res.status(500).json({ error: 'An error occurred during the AI analysis pipeline.' });
  }
});

// Define the port and start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});