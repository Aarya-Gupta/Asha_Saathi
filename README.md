<<<<<<< HEAD
# Asha_Saathi
=======
# ASHA Saathi

## Setup for Development

1. Clone the repository:
   ```bash
   git clone https://github.com/Aarya-Gupta/Asha_Saathi.git
   cd Asha_Saathi
   ```

2. Set up credentials:
   - Copy `.env.example` to `.env` in the server directory
   - Copy `gcloud-credentials.example.json` to `gcloud-credentials.json`
   - Update both files with your actual credentials
   
3. Install dependencies:
   ```bash
   # Backend setup
   cd asha-saathi-app/server
   npm install
   
   # Frontend setup
   cd ../client
   npm install
   ```

4. Start development servers:
   ```bash
   # Terminal 1: Backend
   cd server
   npm run dev
   
   # Terminal 2: Frontend
   cd client
   npm run dev
   ```

## Security Notes
- Never commit real credentials
- Keep `gcloud-credentials.json` and `.env` private
- Use example files as templates
>>>>>>> 58245f6 (first commit)
