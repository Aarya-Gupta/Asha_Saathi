// // Import required packages
// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();
// const multer = require('multer');

// // --- NEW: Import DB connection and Model ---
// const connectDB = require('./config/db');
// const Report = require('./models/Report');

// // --- Google Cloud/AI Clients ---
// const { ImageAnnotatorClient } = require('@google-cloud/vision');
// const { TextToSpeechClient } = require('@google-cloud/text-to-speech'); // Import TTS Client
// const { GoogleGenerativeAI } = require("@google/generative-ai"); // Import Gemini Client

// // --- NEW: Connect to Database ---
// connectDB();

// // --- Initialize Clients ---
// const visionClient = new ImageAnnotatorClient(); // For OCR
// const textToSpeechClient = new TextToSpeechClient(); // For TTS
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // For GenAI

// // Initialize the Express app
// const app = express();

// // Multer Configuration
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// // Middleware setup
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // --- API Routes ---

// // Root route
// app.get('/', (req, res) => {
//   res.status(200).json({ message: "Hello from ASHA Saathi Backend!" });
// });

// // The main analysis route
// app.post('/api/upload', upload.single('reportImage'), async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: "No file uploaded. Please select a file." });
//   }

//   try {
//     // --- STAGE 3: OCR ---
//     console.log('1. Starting OCR process...');
//     const [result] = await visionClient.textDetection(req.file.buffer);
//     const extractedText = result.fullTextAnnotation?.text;

//     if (!extractedText) {
//       console.log('No text found in image.');
//       return res.status(400).json({ error: 'No text could be extracted from the image.' });
//     }
//     console.log('1. OCR Process Completed.');

//     // --- STAGE 4: GenAI Analysis ---
//     console.log('2. Starting GenAI analysis...');
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
//     const prompt = `You are an expert medical assistant for an Indian ASHA health worker. Analyze the following medical report text extracted via OCR. Your task is to provide a response in a clean JSON format. The entire JSON output, including keys and values, must be in simple, conversational Hindi (written in Devanagari script). The JSON should have three keys: "patient_name", "summary", and "action_points". The summary should be a simple, one or two-sentence explanation. The action points should be an array of 2-3 clear, actionable steps for the ASHA worker. Medical Text: "${extractedText}"`;
    
//     const aiResult = await model.generateContent(prompt);
//     const aiResponse = await aiResult.response;
//     let aiResponseText = aiResponse.text();
    
//     // Clean up the response to ensure it's valid JSON
//     aiResponseText = aiResponseText.replace(/```json/g, '').replace(/```/g, '').trim();
//     console.log('2. GenAI Analysis Completed.');

//     const analysisResult = JSON.parse(aiResponseText);
//     const hindiSummary = analysisResult.summary;

//     if (!hindiSummary) {
//         throw new Error("AI model did not return a summary.");
//     }

//     // --- STAGE 4: Text-to-Speech ---
//     console.log('3. Starting Text-to-Speech conversion...');
//     const ttsRequest = {
//       input: { text: hindiSummary },
//       voice: { languageCode: 'hi-IN', name: 'hi-IN-Wavenet-D' }, // A good quality Hindi voice
//       audioConfig: { audioEncoding: 'MP3' },
//     };

//     const [ttsResponse] = await textToSpeechClient.synthesizeSpeech(ttsRequest);
//     const audioContent = ttsResponse.audioContent.toString('base64'); // Convert audio to base64 to send in JSON
//     console.log('3. TTS Conversion Completed.');

//     // --- NEW: STAGE 5 - Save to Database ---
//     console.log('5. Saving analysis to database...');
//     const newReport = new Report({
//         patientName: analysisResult.patient_name,
//         summary: analysisResult.summary,
//         actionPoints: analysisResult.action_points,
//         originalText: extractedText
//     });
//     await newReport.save();
//     console.log('5. Analysis saved successfully.');

//     // --- Final Response ---
//     console.log('4. Sending final structured response.');
//     res.status(200).json({
//       message: "File processed successfully!",
//       analysis: analysisResult, // The structured JSON from Gemini
//       audioContent: audioContent, // The base64 encoded audio
//     });

//   } catch (error) {
//     console.error('ERROR during AI pipeline:', error);
//     res.status(500).json({ error: 'An error occurred during the AI analysis pipeline.' });
//   }
// });

// // Define the port and start the server
// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

// src/index.js

// Import required packages
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const multer = require('multer');

// --- NEW: Import DB connection and Model ---
const connectDB = require('./config/db');
const Report   = require('./models/Report');

// --- Google Cloud/AI Clients ---
const { ImageAnnotatorClient }     = require('@google-cloud/vision');
const { TextToSpeechClient }      = require('@google-cloud/text-to-speech');
const { GoogleGenerativeAI }      = require('@google/generative-ai');

// --- Connect to Database ---
connectDB();

// --- Initialize Clients ---
const visionClient      = new ImageAnnotatorClient();
const textToSpeechClient = new TextToSpeechClient();
const genAI             = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- NEW: Language map for AI prompts & TTS voices ---
const languageMap = {
  en: { name: 'English',   code: 'en-IN', voice: 'en-IN-Wavenet-D' },
  hi: { name: 'Hindi',     code: 'hi-IN', voice: 'hi-IN-Wavenet-D' },
  bn: { name: 'Bengali',   code: 'bn-IN', voice: 'bn-IN-Wavenet-B' },
  te: { name: 'Telugu',    code: 'te-IN', voice: 'te-IN-Wavenet-A' },
  mr: { name: 'Marathi',   code: 'mr-IN', voice: 'mr-IN-Wavenet-C' },
  ta: { name: 'Tamil',     code: 'ta-IN', voice: 'ta-IN-Wavenet-B' },
  ur: { name: 'Urdu',      code: 'ur-IN', voice: 'ur-IN-Wavenet-D' },
  gu: { name: 'Gujarati',  code: 'gu-IN', voice: 'gu-IN-Wavenet-A' },
};

// Initialize Express app
const app = express();

// Multer config for file uploads
const storage = multer.memoryStorage();
const upload  = multer({ storage });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
  res.status(200).json({ message: "Hello from ASHA Saathi Backend!" });
});

// Main upload + analysis route
app.post('/api/upload', upload.single('reportImage'), async (req, res) => {
  // 0️⃣ Validate file
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded. Please select a file." });
  }

  // 1️⃣ Determine language
  const langCode = req.body.language || 'en';
  const lang     = languageMap[langCode];
  if (!lang) {
    return res.status(400).json({ error: "Unsupported language code." });
  }

  try {
    // 2️⃣ OCR
    console.log(`1. Starting OCR for ${lang.name}`);
    const [ocrResult] = await visionClient.textDetection(req.file.buffer);
    const extractedText = ocrResult.fullTextAnnotation?.text;
    if (!extractedText) {
      console.log('No text found in image.');
      return res.status(400).json({ error: 'No text could be extracted from the image.' });
    }
    console.log('1. OCR Process Completed.');

    // 3️⃣ GenAI analysis
    console.log('2. Starting GenAI analysis...');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const prompt = `
You are an expert medical assistant for an Indian ASHA health worker.
Analyze this medical report text extracted via OCR.
Respond in clean JSON, entirely in simple ${lang.name}.
JSON keys: "patient_name", "summary", "action_points".
- "summary": one or two sentences.
- "action_points": array of 2–3 clear, actionable steps.
Medical Text: "${extractedText}"
    `.trim();

    const aiResult     = await model.generateContent(prompt);
    const aiRaw        = await aiResult.response;
    let aiResponseText = aiRaw.text()
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    const analysis = JSON.parse(aiResponseText);
    console.log('2. GenAI Analysis Completed.');

    if (!analysis.summary) {
      throw new Error("AI model did not return a summary.");
    }

    // 4️⃣ Text-to-Speech
    console.log('3. Starting Text-to-Speech conversion...');
    const ttsRequest = {
      input:       { text: analysis.summary },
      voice:       { languageCode: lang.code, name: lang.voice },
      audioConfig: { audioEncoding: 'MP3' },
    };
    const [ttsRes]     = await textToSpeechClient.synthesizeSpeech(ttsRequest);
    const audioContent = ttsRes.audioContent.toString('base64');
    console.log('3. TTS Conversion Completed.');

    // 5️⃣ Save to Database
    console.log('4. Saving analysis to DB...');
    await Report.create({
      patientName:  analysis.patient_name,
      summary:      analysis.summary,
      actionPoints: analysis.action_points,
      originalText: extractedText,
      language:     langCode,
    });
    console.log('4. Saved to DB.');

    // 6️⃣ Final response
    res.status(200).json({
      message:     "File processed successfully!",
      analysis,
      audioContent,
    });

  } catch (error) {
    console.error('ERROR during AI pipeline:', error);
    res.status(500).json({ error: 'An error occurred during the AI analysis pipeline.' });
  }
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
