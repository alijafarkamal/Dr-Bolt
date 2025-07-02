# Dr. Bolt - AI Health Consultation

## ⚠️ Important Disclaimer

⚠️ This project is made public for demonstration purposes only. Unauthorized copying or commercial use is prohibited.

**This is a demo AI medical assistant, not a licensed doctor. Do not use this for real medical decisions.**

## 🚀 Features

- **Conversational Voice Chat**: Speak with Dr. Bolt using your microphone; the AI responds with natural-sounding voice.
- **Continuous Dialogue**: Dr. Bolt keeps asking follow-up questions until it determines enough info is gathered, then unlocks the Results section.
- **Rich Results Section**: After the consultation, Dr. Bolt provides:
  - Diagnosis summary
  - Possible underlying conditions
  - Recommended lab tests
  - Lifestyle modifications
  - Reminders & alerts
  - Follow-up questions
  - Wellness score / risk rating
  - 7-day health plan
  - Recommendations (Do's & Don'ts)
  - Simulated medications (for demo only)
- **Voice-First UI**: All interaction is via voice, with real-time speech recognition and audio playback.
- **Multiple TTS Providers**:
  - **Web Speech API** (default, best reliability, no API key needed)
  - **ElevenLabs** (premium, requires API key, fallback if configured)
  - **Azure Cognitive Services** (premium, requires API key, fallback if configured)
- **Modern UI/UX**: Beautiful, responsive design with smooth animations and easy navigation.
- **PDF Export**: Download your personalized health report as a PDF.

## 📺 Demo Video

Watch a full demo: [YouTube Video](https://www.youtube.com/watch?v=S6qUyRrV6kU)

## 🛠️ Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```
2. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_KEY=your_gemini_api_key_here
   VITE_ELEVENLABS_KEY=your_elevenlabs_api_key_here
   VITE_AZURE_SPEECH_KEY=your_azure_speech_key_here
   ```
   - Get Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Get ElevenLabs key from [ElevenLabs](https://elevenlabs.io/) (optional)
   - Get Azure Speech key from [Azure Portal](https://portal.azure.com/) (optional)
3. **Run Development Server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

## 🎯 How It Works

1. **Start Consultation**: Enter your nickname and begin.
2. **Voice Chat Loop**: Speak your symptoms; Dr. Bolt listens, responds, and keeps the conversation going with follow-up questions. This continues until Dr. Bolt says "Please proceed to the Results section."
3. **Results Section**: Once unlocked, view a comprehensive health report including diagnosis, risks, lab tests, lifestyle advice, reminders, follow-up questions, wellness score, a 7-day plan, recommendations, and simulated medications.
4. **Export**: Download your report as a PDF.

## 🔊 Text-to-Speech (TTS) Providers

- **Web Speech API**: Default and most reliable. No setup required. Multiple high-quality English voices available.
- **ElevenLabs**: Supported as a premium option (requires API key). If not configured or fails, the app falls back to Web Speech API.
- **Azure Cognitive Services**: Supported as a premium option (requires API key). If not configured or fails, the app falls back to Web Speech API.

## 📱 Usage Flow

1. **Enter Nickname**
2. **Start Consultation**
3. **Voice Interaction**: Click the microphone, speak, and listen to Dr. Bolt's voice responses.
4. **Continue**: The conversation continues in a loop until Dr. Bolt decides enough info is gathered.
5. **View Results**: Results tab unlocks with a detailed, personalized health report.

## 🧩 UI Components

- **Header**: Dr. Bolt logo and badge
- **Disclaimer**: Medical disclaimer banner
- **Navigation**: Tab-based navigation (Home, Results, Contact)
- **Home Tab**: Voice chat interface
- **Results Tab**: Full health analysis and PDF export
- **Contact Tab**: Contact info and social links

## 🔒 Security & Privacy

- All API keys are stored in environment variables
- No hardcoded sensitive data
- Client-side only; no server required
- Medical disclaimers throughout the app

## 🛠️ Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Tech Stack
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React (icons)
- Gemini AI API
- ElevenLabs TTS API (optional)
- Azure Cognitive Services (optional)

## 📄 License

This project is for educational and demonstration purposes only.

---

**Remember**: Always consult a real healthcare provider for medical advice. 
