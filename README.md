# ASHA Saathi 🇮🇳

**From Text to Trust: Empowering India's Health Heroes with AI.**

[![Hackathon](https://img.shields.io/badge/AI%20Manthan-2025-brightgreen.svg)](https://cai.iiitd.ac.in/) 
[![Status](https://img.shields.io/badge/status-complete-green.svg)](https://github.com/) 
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**ASHA Saathi** is a full-stack web application designed for the AI Manthan 2025 hackathon. It directly tackles **Problem Statement 2: ASHA Saathi: 1-Click Health Summary Generator**. Our mission is to empower India's frontline ASHA health workers by using a multimodal AI pipeline to instantly convert complex, multilingual medical reports into simple, actionable, and audible summaries in their native language.

---

## The Problem: The Unseen Burden on Our Health Heroes

India's healthcare system is supported by over **one million** Accredited Social Health Activists (ASHAs). These community health workers are the critical link between trained doctors and the rural population. However, they are often crushed by an immense administrative and cognitive burden.

*   **🕰️ The Time Drain:** Public health studies reveal that ASHA workers spend nearly **50% of their week**—up to 20 hours—on manual paperwork, documentation, and record-keeping, drastically reducing their time for actual patient care.
*   **📱 The App Fatigue:** A single ASHA worker is often forced to navigate **3 to 5 different, complex government apps** for various health initiatives, each with its own interface and login, leading to significant stress and inefficiency.
*   **🗣️ The Communication Gap:** With an average education level of 8th-10th grade, they are expected to decipher complex, English-based, often handwritten medical reports and accurately translate the instructions to a rural population where over **70% of adults have low health literacy**. This gap can lead to medical errors and poor patient outcomes.

The current system asks our health heroes to be data clerks, translators, and tech experts, all while being primary caregivers. This is an unsustainable and critical failure point in our last-mile healthcare delivery.

---

## Our Solution: ASHA Saathi - The AI Companion

ASHA Saathi is an incredibly simple tool designed to eliminate this burden. It acts as an AI-powered companion that an ASHA worker can rely on to see, understand, and speak the language of healthcare.

### The User Journey (In Under 30 Seconds)

1.  **Select Language:** The ASHA worker opens the app and selects her preferred language from a list of major Indian languages (e.g., Hindi, Tamil, Bengali).
2.  **Scan Report:** She takes a clear picture of any medical document—a prescription, a lab report, a discharge summary.
3.  **Get Instant Clarity:** In seconds, the app displays a clean, structured summary on her screen:
    *   **Patient's Name**
    *   **A Simple, 2-Sentence Summary** of the core diagnosis.
    *   **A "Play Audio" Button** that speaks the summary aloud in a natural, native voice.
    *   **Clear, Actionable Next Steps** for her to follow up on.

She no longer needs to guess. She can play the audio summary directly to the patient, ensuring perfect understanding and building trust.

### Live Demo

*(Here you would embed a GIF showing the app flow: selecting a language, uploading the Abhishek Bansal report, and showing the final result with the audio playing.)*

![ASHA Saathi Demo GIF](_readme-assets/demo.gif)

---

## Key Features

*   **1-Click OCR:** Utilizes Google's powerful Vision API to accurately digitize text from any image, even with challenging handwriting.
*   **Multilingual GenAI Summarization:** A dynamic prompt instructs the Gemini 1.5 Flash model to generate a structured JSON summary in the user's chosen language.
*   **Natural Vernacular Audio:** Integrates with Google's high-quality WaveNet TTS voices to produce clear, human-sounding audio summaries in multiple Indian languages.
*   **Actionable Intelligence:** The AI doesn't just summarize; it provides a checklist of concrete next steps for the ASHA worker, turning data into a care plan.
*   **Simple & Intuitive UI:** A clean, minimal interface built with React ensures that ASHA workers of all technical abilities can use the app with zero training.

---

## Technical Architecture & Tech Stack

We've built a robust, full-stack application using a modern and scalable technology stack. The core of our project is a linear AI pipeline that seamlessly integrates best-in-class services.

### Architecture Flow

`User (React Frontend)` -> `Uploads Image + Language Code` -> `Backend (Node.js/Express)` -> `[1. Vision API (OCR)]` -> `[2. Gemini API (Summarize)]` -> `[3. TTS API (Audio)]` -> `[4. MongoDB (Save)]` -> `Returns JSON + Audio` -> `User (React Frontend)`

### Tech Stack Deep Dive

| Component      | Technology                                    | Why We Chose It                                                                                                                                                                                                                                                                                           |
| :------------- | :-------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**   | React.js (with Vite)                          | **Speed & Responsiveness:** Vite provides a lightning-fast development experience, crucial for a hackathon. React's component-based architecture allowed us to build a clean, manageable, and stateful UI for handling file uploads, loading states, and multilingual content.                                     |
| **Backend**    | Node.js & Express.js                          | **Efficiency & Speed:** Node.js's asynchronous, non-blocking nature is perfect for an I/O-heavy application like ours, which involves waiting for multiple external API calls (OCR, GenAI, TTS). Express provides a minimal and flexible framework to build our API endpoints quickly.                   |
| **Database**   | MongoDB Atlas                                 | **Flexibility & Scalability:** The unstructured, document-based nature of MongoDB is ideal for storing our semi-structured JSON outputs from the AI. Atlas provides a fully-managed, free-tier cloud database that is easy to set up and scale, saving us valuable time on database administration.           |
| **AI - OCR**   | Google Vision API                             | **Accuracy:** Google Vision API is the industry leader for OCR, demonstrating exceptional accuracy in recognizing printed, handwritten, and multilingual text from images, which is a core requirement for our application.                                                                                 |
| **AI - Brain** | **Google Gemini 1.5 Flash**                     | **Speed, Multilingualism, & Cost:** We chose Flash for its extremely low latency (critical for user experience), strong performance in Indian languages, and its excellent free tier via Google AI Studio. Its reliable instruction-following for JSON output was key to the stability of our backend. |
| **AI - Voice** | Google Cloud TTS (WaveNet)                    | **Quality:** Google's WaveNet voices are incredibly natural and human-sounding, which is essential for building trust when playing an audio summary to a patient. The API supports a wide range of high-quality voices for major Indian languages.                                                           |
| **Data Format**  | **Base64 Audio Encoding**                       | **Simplicity & Atomic Responses:** Instead of setting up a complex cloud storage solution to host audio files, we encoded the MP3 audio into a Base64 string. This allows us to send the text summary and the audio together in a single, atomic API response, drastically simplifying the frontend logic. |

---

## Installation & Setup

Follow these steps to run the project locally.

### Prerequisites
- Node.js (v20.x or later)
- npm / yarn
- A Google Cloud Platform account with billing enabled (for the free tier of Vision & TTS)
- A Google AI Studio API Key for Gemini

### 1. Backend Setup

```bash
# Clone the repository
git clone https://github.com/your-username/asha-saathi-app.git

# Navigate to the server directory
cd asha-saathi-app/server

# Install dependencies
npm install

# Create the environment file
touch .env
````

Now, populate the `server/.env` file with your credentials:

```env
# Path to your Google Cloud service account JSON key
GOOGLE_APPLICATION_CREDENTIALS="./gcloud-credentials.json"

# API Key from Google AI Studio
GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"

# Connection string from MongoDB Atlas
MONGO_URI="mongodb+srv://..."
```

**Important**: Place your downloaded `gcloud-credentials.json` file in the `server/` directory.

---

### 2. Frontend Setup

```bash
# In a new terminal, navigate to the client directory
cd asha-saathi-app/client

# Install dependencies
npm install
```

---

### 3. Running the Application

* Start the backend server:

  ```bash
  npm run dev
  ```

* Start the frontend server:

  ```bash
  npm run dev
  ```

* Open your browser and navigate to:
  [http://localhost:5173](http://localhost:5173)

---

## The Impact, Quantified

Our solution doesn't just offer convenience; it's a verifiable national force multiplier.

Based on National Health Mission data, there are over 1,000,000 ASHA workers. With a conservative estimate of saving just 1 hour per day for each worker, the impact is:

**365 Million Hours of Patient Care Capacity Unlocked Annually**

This is the time equivalent of adding over **180,000** new, full-time health workers to India's system — without any additional cost.

---

## Future Work

This hackathon prototype is a powerful proof-of-concept. The next steps to make it production-ready would be:

* **Offline First Mode**: Using on-device OCR and caching to allow the app to function in low-connectivity areas.
* **Patient History & Reminders**: Allowing ASHAs to save summaries under a patient's profile and set medication or follow-up reminders.
* **True Agentic Workflow**: Evolving the backend from a linear pipeline to an intelligent agent that can reason about its tools. For example, it could decide to call a patient history API if a name is found, or handle a wider variety of medical documents dynamically.
* **Sovereign AI Integration**: Evaluating and potentially migrating the summarization model to an India-focused provider like Sarvam AI to further the "Bharat-First" mission.

---

**Built with ❤️ for AI Manthan 2025 by Tech for Seva.**
