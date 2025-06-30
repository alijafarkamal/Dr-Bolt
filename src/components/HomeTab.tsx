import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, RotateCcw, Brain, AlertCircle, Volume2, VolumeX } from 'lucide-react';
import { ConversationMessage } from '../types';
import { callGeminiAPI } from '../utils/apiUtils';

interface AudioMessage {
  id: string;
  text: string;
  role: 'patient' | 'doctor';
  audioUrl?: string;
  isPlaying: boolean;
  ttsProvider: 'elevenlabs' | 'webspeech' | 'azure';
}

interface VoiceOption {
  name: string;
  lang: string;
  voice: SpeechSynthesisVoice;
}

interface HomeTabProps {
  conversationHistory: ConversationMessage[];
  addToConversation: (message: ConversationMessage) => void;
  nickname: string;
  setNickname: (name: string) => void;
  onUnlockResults: () => void;
  onResetConversation: () => void;
}

const HomeTab: React.FC<HomeTabProps> = ({
  conversationHistory,
  addToConversation,
  nickname,
  setNickname,
  onUnlockResults,
  onResetConversation
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [audioMessages, setAudioMessages] = useState<AudioMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [availableVoices, setAvailableVoices] = useState<VoiceOption[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption | null>(null);

  const recognitionRef = useRef<any>(null);

  // Initialize voices
  useEffect(() => {
    const loadVoices = () => {
      if ('speechSynthesis' in window) {
        const voices = speechSynthesis.getVoices();
        const highQualityVoices = voices
          .filter(voice => 
            voice.lang.startsWith('en') && 
            (voice.name.includes('Google') || 
             voice.name.includes('Microsoft') ||
             voice.name.includes('Samantha') ||
             voice.name.includes('Alex') ||
             voice.name.includes('Daniel') ||
             voice.name.includes('Victoria') ||
             voice.name.includes('Karen') ||
             voice.name.includes('Tom') ||
             voice.name.includes('Fiona') ||
             voice.name.includes('Moira') ||
             voice.name.includes('Tessa') ||
             voice.name.includes('Fred') ||
             voice.name.includes('Ralph') ||
             voice.name.includes('Ava') ||
             voice.name.includes('Zoe') ||
             voice.name.includes('UK') ||
             voice.name.includes('US'))
          )
          .map(voice => ({
            name: voice.name,
            lang: voice.lang,
            voice: voice
          }))
          .slice(0, 20); // Top 20 voices
        
        console.log('🎤 Available voices:', highQualityVoices.map(v => v.name));
        setAvailableVoices(highQualityVoices);
        
        // Set default voice - prefer Google voices
        const defaultVoice = highQualityVoices.find(v => 
          v.name.includes('Google UK English Female') ||
          v.name.includes('Google US English Female') ||
          v.name.includes('Samantha') ||
          v.name.includes('Alex')
        ) || highQualityVoices[0];
        
        if (defaultVoice) {
          setSelectedVoice(defaultVoice);
          console.log('🎤 Selected default voice:', defaultVoice.name);
        }
      }
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started');
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript + interimTranscript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
      };
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      setTranscript('');
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  // High-quality Web Speech API implementation
  const generateWebSpeechAudio = async (text: string): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window) || !selectedVoice) {
        reject(new Error('Web Speech API not available'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = selectedVoice.voice;
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.9;

      // Create audio context to capture speech
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      utterance.onend = () => {
        // For Web Speech API, we'll use the browser's built-in playback
        // and create a simple audio blob for consistency
        const dummyBlob = new Blob([''], { type: 'audio/mpeg' });
        resolve(dummyBlob);
      };

      utterance.onerror = (error) => {
        reject(new Error(`Web Speech error: ${error.error}`));
      };

      speechSynthesis.speak(utterance);
    });
  };

  // Azure Cognitive Services TTS (if you have Azure key)
  const generateAzureAudio = async (text: string): Promise<Blob> => {
    const azureKey = import.meta.env.VITE_AZURE_SPEECH_KEY;
    if (!azureKey) {
      console.warn('Azure Speech key not configured. Using Web Speech API fallback.');
      return generateWebSpeechAudio(text);
    }

    try {
      const response = await fetch(`https://eastus.tts.speech.microsoft.com/cognitiveservices/v1`, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': azureKey,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
          'User-Agent': 'DrBoltApp'
        },
        body: `<speak version='1.0' xml:lang='en-US'>
          <voice xml:lang='en-US' xml:gender='Female' name='en-US-JennyNeural'>
            ${text}
          </voice>
        </speak>`
      });

      if (!response.ok) {
        console.warn(`Azure TTS error: ${response.status}. Using Web Speech API fallback.`);
        return generateWebSpeechAudio(text);
      }

      return await response.blob();
    } catch (error) {
      console.warn('Azure TTS failed. Using Web Speech API fallback.');
      return generateWebSpeechAudio(text);
    }
  };

  const createAudioMessage = async (text: string, role: 'patient' | 'doctor'): Promise<AudioMessage> => {
    const id = Date.now().toString();
    const message: AudioMessage = {
      id,
      text,
      role,
      isPlaying: false,
      ttsProvider: 'webspeech'
    };

    // For doctor messages, we'll use Web Speech API directly
    // No need to create audio blobs to avoid double playback
    return message;
  };

  // Keep ElevenLabs as fallback
  const generateElevenLabsAudio = async (text: string): Promise<Blob> => {
    const apiKey = import.meta.env.VITE_ELEVENLABS_KEY;
    console.log('🔍 Debug - API Key check:', {
      hasKey: !!apiKey,
      keyLength: apiKey?.length,
      keyStart: apiKey?.substring(0, 10) + '...',
      keyEnd: apiKey?.substring(apiKey.length - 4),
      envVars: Object.keys(import.meta.env).filter(key => key.includes('ELEVENLABS')),
      fullKey: apiKey
    });
    
    if (!apiKey || apiKey === 'your_elevenlabs_api_key_here') {
      console.warn('ElevenLabs API key not configured. Using Web Speech API fallback.');
      return generateWebSpeechAudio(text);
    }

    console.log('🚀 Making ElevenLabs API request...');
    
    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true
          },
        })
      });

      console.log('📊 ElevenLabs response status:', response.status);
      
      if (!response.ok) {
        if (response.status === 401) {
          console.error('❌ ElevenLabs API: Unauthorized - Check your API key');
          console.warn('Using Web Speech API fallback.');
          return generateWebSpeechAudio(text);
        }
        const errorText = await response.text();
        console.error('❌ ElevenLabs API error:', response.status, errorText);
        console.warn('Using Web Speech API fallback.');
        return generateWebSpeechAudio(text);
      }

      console.log('✅ ElevenLabs API request successful!');
      return await response.blob();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('CORS')) {
        console.error('❌ CORS error detected - this is expected when calling ElevenLabs from browser');
        console.warn('Using Web Speech API fallback.');
        return generateWebSpeechAudio(text);
      }
      console.warn('ElevenLabs API failed. Using Web Speech API fallback.');
      return generateWebSpeechAudio(text);
    }
  };

  const playAudioMessage = (message: AudioMessage) => {
    // Stop current audio if playing
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    
    // Stop any current speech synthesis
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }

    // Set playing state
    setAudioMessages(prev => prev.map(msg => 
      msg.id === message.id ? { ...msg, isPlaying: true } : { ...msg, isPlaying: false }
    ));

    if (message.role === 'doctor') {
      // Use browser speech synthesis directly
      useBrowserSpeechSynthesis(message.text);
    }
  };

  const useBrowserSpeechSynthesis = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.9;
      
      if (selectedVoice) {
        utterance.voice = selectedVoice.voice;
      }
      
      utterance.onstart = () => {
        console.log('🎤 Doctor speaking:', text);
      };
      
      utterance.onend = () => {
        console.log('✅ Doctor finished speaking');
        // Reset playing state when speech ends
        setAudioMessages(prev => prev.map(msg => ({ ...msg, isPlaying: false })));
      };
      
      utterance.onerror = () => {
        console.log('❌ Speech synthesis error');
        // Reset playing state on error
        setAudioMessages(prev => prev.map(msg => ({ ...msg, isPlaying: false })));
      };
      
      speechSynthesis.speak(utterance);
    }
  };

  const stopAudioMessage = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }
    // Stop speech synthesis
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    setAudioMessages(prev => prev.map(msg => ({ ...msg, isPlaying: false })));
  };

  const handleSpeechResult = async () => {
    if (!transcript.trim() || isProcessing) return;

    setIsProcessing(true);
    const patientMessage = transcript.trim();

    try {
      // Add patient message to conversation
      const newConversationHistory: ConversationMessage[] = [
        ...conversationHistory,
        { role: 'patient', content: patientMessage, timestamp: new Date() }
      ];
      addToConversation(newConversationHistory[newConversationHistory.length - 1]);

      // Create patient audio message
      const patientAudioMessage = await createAudioMessage(patientMessage, 'patient');
      setAudioMessages(prev => [...prev, patientAudioMessage]);

      // Get doctor response
      const doctorResponse = await callGeminiAPI(newConversationHistory);
      
      // Check if doctor wants to proceed to results
      if (doctorResponse.includes('Please proceed to the Results section')) {
        // Handle transition to results
        console.log('Doctor indicates enough information gathered');
        onUnlockResults();
      }

      // Add doctor response to conversation
      const updatedConversationHistory: ConversationMessage[] = [
        ...newConversationHistory,
        { role: 'doctor', content: doctorResponse, timestamp: new Date() }
      ];
      addToConversation(updatedConversationHistory[updatedConversationHistory.length - 1]);

      // Create doctor audio message
      const doctorAudioMessage = await createAudioMessage(doctorResponse, 'doctor');
      setAudioMessages(prev => [...prev, doctorAudioMessage]);

      // Auto-play doctor's response
      setTimeout(() => {
        playAudioMessage(doctorAudioMessage);
      }, 500);

    } catch (error) {
      console.error('Error processing speech:', error);
    } finally {
      setIsProcessing(false);
      setTranscript('');
    }
  };

  useEffect(() => {
    if (!isListening && transcript.trim()) {
      // Call the async function properly
      handleSpeechResult().catch(error => {
        console.error('Error in handleSpeechResult:', error);
      });
    }
  }, [isListening]);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dr. Bolt Consultation</h1>
            <p className="text-gray-600 mt-1">Voice-powered health assistant</p>
          </div>
          
          {/* Voice Selection */}
          <div className="flex items-center gap-4">
            {availableVoices.length > 0 && (
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-gray-700">Voice:</label>
                <select
                  value={selectedVoice?.name || ''}
                  onChange={(e) => {
                    const voice = availableVoices.find(v => v.name === e.target.value);
                    setSelectedVoice(voice || null);
                  }}
                  className="text-xs px-2 py-1 border border-gray-300 rounded-md bg-white"
                >
                  {availableVoices.map((voice) => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Conversation Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {audioMessages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p>Start speaking to begin your consultation with Dr. Bolt</p>
          </div>
        )}

        {audioMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'patient' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                message.role === 'patient'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-800 shadow-sm border'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <p className="text-sm">{message.text}</p>
                  {message.role === 'doctor' && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-500">
                        Voice: {message.ttsProvider === 'webspeech' ? 'Web Speech' : 
                               message.ttsProvider === 'elevenlabs' ? 'ElevenLabs' : 'Azure'}
                      </span>
                      {message.ttsProvider === 'webspeech' && selectedVoice && (
                        <span className="text-xs text-gray-400">({selectedVoice.name})</span>
                      )}
                    </div>
                  )}
                </div>
                
                {message.role === 'doctor' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => message.isPlaying ? stopAudioMessage() : playAudioMessage(message)}
                      className={`p-2 rounded-full transition-colors ${
                        message.isPlaying
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                      title={message.isPlaying ? 'Stop audio' : 'Play audio'}
                    >
                      {message.isPlaying ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {(isProcessing || isGenerating) && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 shadow-sm border px-4 py-3 rounded-2xl">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span className="text-sm">
                  {isGenerating ? 'Generating audio...' : 'Dr. Bolt is thinking...'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Voice Input Area */}
      <div className="bg-white border-t px-6 py-4">
        <div className="flex items-center gap-4">
          {/* Transcript Display */}
          <div className="flex-1 min-h-[60px] max-h-[120px] overflow-y-auto bg-gray-100 rounded-lg px-4 py-3">
            {transcript ? (
              <p className="text-gray-800 text-sm">{transcript}</p>
            ) : (
              <p className="text-gray-500 text-sm">
                {isListening ? 'Listening...' : 'Tap the microphone to start speaking'}
              </p>
            )}
          </div>

          {/* Microphone Button */}
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={isProcessing || isGenerating}
            className={`p-4 rounded-full transition-all duration-200 ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg'
                : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg'
            } ${(isProcessing || isGenerating) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isListening ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span className={`flex items-center gap-1 ${isListening ? 'text-red-500' : ''}`}>
              <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`}></div>
              {isListening ? 'Recording' : 'Ready'}
            </span>
            {(isProcessing || isGenerating) && (
              <span className="flex items-center gap-1 text-blue-500">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                {isGenerating ? 'Generating Audio...' : 'Processing...'}
              </span>
            )}
          </div>
          
          <div className="text-right">
            <p>Messages: {audioMessages.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeTab;