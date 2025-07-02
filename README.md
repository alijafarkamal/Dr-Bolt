# Dr. Bolt - AI Health Consultation

A fully responsive, modern React + Vite + Tailwind CSS medical consultation web app that provides AI-powered health guidance through voice interactions.

## ⚠️ Important Disclaimer

**This is a demo AI medical assistant, not a licensed doctor. Do not use this for real medical decisions.**

## 🚀 Features

- **Voice-First Interaction**: Natural voice conversation with AI
- **Real API Integration**: Uses Gemini AI and ElevenLabs for authentic responses
- **Personalized Health Plans**: 7-day customized health recommendations
- **Modern UI/UX**: Beautiful, responsive design with smooth animations
- **Progressive Disclosure**: Results unlock only after consultation completion
- 🎤 **Voice Input**: Real-time speech recognition
- 🤖 **AI Doctor**: Powered by Google Gemini AI
- 🔊 **Multiple TTS Providers**: 
  - **Web Speech API** (Default - Best quality, no API key needed)
  - **ElevenLabs** (Premium voices - requires API key)
  - **Azure Cognitive Services** (Premium voices - requires API key)
- 🎵 **Audio Playback**: Play/stop doctor responses
- 📱 **Responsive Design**: Works on desktop and mobile

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory:

```env
VITE_GEMINI_KEY=your_gemini_api_key_here
VITE_ELEVENLABS_KEY=your_elevenlabs_api_key_here
VITE_AZURE_SPEECH_KEY=your_azure_speech_key_here
```

#### Getting API Keys:

**Gemini API Key:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your `.env` file

**ElevenLabs API Key:**
1. Go to [ElevenLabs](https://elevenlabs.io/)
2. Sign up and get your API key
3. Copy the key to your `.env` file

**Azure Speech Key:**
1. Go to [Azure Portal](https://portal.azure.com/)
2. Create a new Cognitive Services resource
3. Copy the key to your `.env` file

### 3. Run Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🎯 How It Works

### 1. Welcome & Nickname
- App greets user with voice: "What's your nickname?"
- User enters nickname and starts consultation

### 2. Voice Consultation Loop
- User clicks microphone → speaks → STT converts to text
- Text sent to Gemini AI for analysis
- Gemini responds → ElevenLabs TTS speaks the response
- **No text displayed** - voice-only interaction
- Continues until Gemini says "Please proceed to the Results section"

### 3. Results Generation
- Full conversation sent to Gemini for health plan generation
- Displays personalized:
  - 7-Day Health Plan
  - Recommendations (Do's & Don'ts)
  - Simulated Medications

## 🔧 Technical Implementation

### API Integration
- **Gemini AI**: For conversation responses and health analysis
- **ElevenLabs**: For natural text-to-speech
- **Azure Cognitive Services**: For text-to-speech
- **Fallback**: Browser speech synthesis if APIs unavailable

### State Management
- React hooks for conversation history
- Progressive tab unlocking
- Real-time voice interaction states

### Voice Flow
1. User speech → STT (simulated)
2. Text → Gemini API
3. Response → ElevenLabs TTS
4. Voice output (no text display)

## 📱 Usage Flow

1. **Enter Nickname**: Type your preferred name
2. **Start Consultation**: Click "Start Consultation"
3. **Voice Interaction**: Click microphone and speak your health concerns
4. **Listen & Respond**: Dr. Bolt will ask follow-up questions
5. **Continue Conversation**: Keep speaking until consultation is complete
6. **View Results**: Results tab unlocks with personalized health plan

## 🎨 UI Components

- **Header**: Dr. Bolt logo and Bolt badge with hover effects
- **Disclaimer**: Medical disclaimer banner
- **Navigation**: Tab-based navigation with locked states
- **Home Tab**: Voice interaction interface
- **Results Tab**: Health analysis display
- **Contact Tab**: Contact information

## 🔒 Security & Privacy

- All API calls use environment variables
- No hardcoded sensitive data
- Client-side only - no server required
- Medical disclaimers throughout the app

## 🚨 Important Notes

- **Demo Only**: Not for real medical advice
- **API Keys Required**: For full functionality
- **Fallback Mode**: Works without API keys (simulated responses)
- **Voice Only**: Text responses not displayed during consultation
- **Real APIs**: Uses actual Gemini and ElevenLabs when configured

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Tech Stack
- React 18.3.1
- TypeScript
- Vite 5.4.2
- Tailwind CSS 3.4.1
- Lucide React (icons)
- Gemini AI API
- ElevenLabs TTS API
- Azure Cognitive Services

## 📄 License

This project is for educational and demonstration purposes only.

---

**Remember**: Always consult a real healthcare provider for medical advice. 

## TTS Provider Setup

### 1. Web Speech API (Recommended - No Setup Required)
- ✅ **Works out of the box** - no API key needed
- ✅ **High quality** English voices
- ✅ **Free** and reliable
- ✅ **Multiple voice options** available

### 2. ElevenLabs (Premium - Optional)
- Get API key from [ElevenLabs](https://elevenlabs.io/)
- Add to `.env`: `VITE_ELEVENLABS_KEY=your_key_here`
- **Voice ID**: `21m00Tcm4TlvDq8ikWAM` (Rachel voice)

### 3. Azure Cognitive Services (Premium - Optional)
- Get API key from [Azure Portal](https://portal.azure.com/)
- Add to `.env`: `VITE_AZURE_SPEECH_KEY=your_key_here`
- **Voice**: `en-US-JennyNeural` (Female, English)

## Troubleshooting

### ElevenLabs 401 Error
- Check your API key is correct
- Restart the dev server after adding the key
- ElevenLabs may have CORS restrictions in browsers

### No Audio Output
- Check browser permissions for audio
- Try different TTS providers
- Web Speech API works best as fallback

### Voice Quality Issues
- Try different voice options in Web Speech API
- Premium providers (ElevenLabs/Azure) offer better quality
- Adjust voice settings in the code if needed 
