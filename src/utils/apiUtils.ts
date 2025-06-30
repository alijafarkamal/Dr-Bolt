import { ConversationMessage, AnalysisResult } from '../types';

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// Check if environment variables are available
const hasGeminiKey = import.meta.env.VITE_GEMINI_KEY && import.meta.env.VITE_GEMINI_KEY !== 'your_gemini_api_key_here';
const hasElevenLabsKey = import.meta.env.VITE_ELEVENLABS_KEY && import.meta.env.VITE_ELEVENLABS_KEY !== 'your_elevenlabs_api_key_here';

// Real Gemini API call
export const callGeminiAPI = async (conversationHistory: ConversationMessage[]): Promise<string> => {
  if (!hasGeminiKey) {
    // Return a fallback response instead of throwing an error
    console.warn('Gemini API key not configured. Using fallback response.');
    return "Hello! I'm Dr. Bolt, your AI health assistant. I'm here to help you with your health concerns. Could you please tell me what brings you in today?";
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are Dr. Bolt, a caring AI health assistant having an ongoing conversation with a patient. 

IMPORTANT RULES:
- Keep responses short (2-3 lines maximum)
- Focus on gathering information and asking follow-up questions
- Be empathetic and professional
- Only ask one question at a time
- When you have gathered enough information to provide a comprehensive health plan, end your response with exactly: "Please proceed to the Results section."

Current conversation: ${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Provide a brief, caring response that continues gathering information from the patient.`
          }]
        }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API response:', errorText);
      console.warn('Gemini API failed. Using fallback response.');
      return "I understand you're not feeling well. Let me help you gather more information about your symptoms. Could you please describe what you're experiencing in more detail?";
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini API error:', error);
    console.warn('Using fallback response due to API error.');
    return "I'm here to help you with your health concerns. Could you please tell me more about what brings you in today?";
  }
};

// Real ElevenLabs TTS API call
export const callElevenLabsTTS = async (text: string): Promise<void> => {
  if (!hasElevenLabsKey) {
    // Fallback to browser speech synthesis
    return simulateTextToSpeech(text);
  }

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': import.meta.env.VITE_ELEVENLABS_KEY,
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      })
    });

    if (!response.ok) {
      if (response.status === 401) {
        console.error('ElevenLabs API: Unauthorized - Check your API key');
        // Fallback to browser speech synthesis
        return simulateTextToSpeech(text);
      }
      console.warn(`ElevenLabs API error: ${response.status}. Using browser speech synthesis.`);
      return simulateTextToSpeech(text);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    await audio.play();
  } catch (error) {
    console.error('ElevenLabs API error:', error);
    await simulateTextToSpeech(text);
  }
};

// Real Gemini API call for health analysis
export const generateHealthAnalysis = async (conversationHistory: ConversationMessage[]): Promise<AnalysisResult> => {
  if (!hasGeminiKey) {
    // Return a fallback analysis instead of throwing an error
    console.warn('Gemini API key not configured. Using fallback analysis.');
    return {
      diagnosis: "Based on our conversation, I recommend consulting with a healthcare professional for a proper diagnosis.",
      healthPlan: [
        { day: 1, title: "Day 1 - Rest and Hydration", activities: ["Get adequate rest", "Stay hydrated", "Monitor symptoms"] },
        { day: 2, title: "Day 2 - Gentle Activity", activities: ["Light walking", "Continue hydration", "Rest as needed"] },
        { day: 3, title: "Day 3 - Gradual Return", activities: ["Moderate activity", "Healthy eating", "Good sleep"] },
        { day: 4, title: "Day 4 - Normal Routine", activities: ["Regular exercise", "Balanced diet", "Stress management"] },
        { day: 5, title: "Day 5 - Wellness Focus", activities: ["Physical activity", "Mental wellness", "Social connection"] },
        { day: 6, title: "Day 6 - Health Maintenance", activities: ["Exercise routine", "Healthy habits", "Preventive care"] },
        { day: 7, title: "Day 7 - Long-term Health", activities: ["Sustain healthy lifestyle", "Regular check-ups", "Wellness practices"] }
      ],
      recommendations: [
        {
          category: "Lifestyle",
          dos: ["Get 7-9 hours of sleep", "Exercise regularly", "Manage stress"],
          donts: ["Avoid excessive screen time", "Don't skip meals", "Avoid sedentary lifestyle"]
        },
        {
          category: "Diet",
          dos: ["Eat balanced meals", "Stay hydrated", "Include fruits and vegetables"],
          donts: ["Avoid processed foods", "Don't skip breakfast", "Limit sugary drinks"]
        }
      ],
      medications: [
        {
          name: "Consult your doctor",
          dosage: "As prescribed",
          frequency: "As needed",
          duration: "Until symptoms improve"
        }
      ]
    };
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a comprehensive AI health assistant. Based on this health consultation conversation:
${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Generate a detailed, patient-friendly health report in the following EXACT JSON structure. Each section should be clear, medically relevant, and easy to understand. If a section is not relevant, return it as an empty array or string, but always include all sections:

{
  "diagnosisSummary": "Short, human-like summary of the likely condition (e.g., 'You may be exhibiting early signs of type 2 diabetes...')",
  "possibleUnderlyingConditions": ["Condition 1", "Condition 2", ...],
  "recommendedLabTests": ["Test 1", "Test 2", ...],
  "lifestyleModifications": ["Specific advice, e.g., 'Drink 2.5L water/day'", "Walk 5,000 steps minimum", ...],
  "reminders": ["Take medication at 8 AM daily", "Test sugar after fasting every 3 days", ...],
  "followUpQuestions": ["Next time, bring your lab reports.", "Note when symptoms occur during the day.", ...],
  "wellnessScore": {
    "score": "🟡 Medium Risk | 🔴 High Risk | 🟢 Low Risk", 
    "explanation": "What this means for the patient"
  },
  "healthPlan": [
    {"day": 1, "title": "Day title", "activities": ["activity1", "activity2", "activity3"]},
    {"day": 2, "title": "Day title", "activities": ["activity1", "activity2", "activity3"]},
    {"day": 3, "title": "Day title", "activities": ["activity1", "activity2", "activity3"]},
    {"day": 4, "title": "Day title", "activities": ["activity1", "activity2", "activity3"]},
    {"day": 5, "title": "Day title", "activities": ["activity1", "activity2", "activity3"]},
    {"day": 6, "title": "Day title", "activities": ["activity1", "activity2", "activity3"]},
    {"day": 7, "title": "Day title", "activities": ["activity1", "activity2", "activity3"]}
  ],
  "recommendations": [
    {"category": "Lifestyle", "dos": ["do1", "do2", "do3"], "donts": ["dont1", "dont2", "dont3"]},
    {"category": "Diet", "dos": ["do1", "do2", "do3"], "donts": ["dont1", "dont2", "dont3"]}
  ],
  "medications": [
    {"name": "medication name", "dosage": "dosage instructions", "frequency": "how often", "duration": "how long to take"}
  ]
}

IMPORTANT: Return ONLY valid JSON. Do not include any explanation or text outside the JSON.`
          }]
        }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API response:', errorText);
      console.warn('Gemini API failed. Using fallback analysis.');
      return {
        diagnosis: "Based on our conversation, I recommend consulting with a healthcare professional for a proper diagnosis.",
        healthPlan: [
          { day: 1, title: "Day 1 - Rest and Hydration", activities: ["Get adequate rest", "Stay hydrated", "Monitor symptoms"] },
          { day: 2, title: "Day 2 - Gentle Activity", activities: ["Light walking", "Continue hydration", "Rest as needed"] },
          { day: 3, title: "Day 3 - Gradual Return", activities: ["Moderate activity", "Healthy eating", "Good sleep"] },
          { day: 4, title: "Day 4 - Normal Routine", activities: ["Regular exercise", "Balanced diet", "Stress management"] },
          { day: 5, title: "Day 5 - Wellness Focus", activities: ["Physical activity", "Mental wellness", "Social connection"] },
          { day: 6, title: "Day 6 - Health Maintenance", activities: ["Exercise routine", "Healthy habits", "Preventive care"] },
          { day: 7, title: "Day 7 - Long-term Health", activities: ["Sustain healthy lifestyle", "Regular check-ups", "Wellness practices"] }
        ],
        recommendations: [
          {
            category: "Lifestyle",
            dos: ["Get 7-9 hours of sleep", "Exercise regularly", "Manage stress"],
            donts: ["Avoid excessive screen time", "Don't skip meals", "Avoid sedentary lifestyle"]
          },
          {
            category: "Diet",
            dos: ["Eat balanced meals", "Stay hydrated", "Include fruits and vegetables"],
            donts: ["Avoid processed foods", "Don't skip breakfast", "Limit sugary drinks"]
          }
        ],
        medications: [
          {
            name: "Consult your doctor",
            dosage: "As prescribed",
            frequency: "As needed",
            duration: "Until symptoms improve"
          }
        ]
      };
    }

    const data = await response.json();
    const responseText = data.candidates[0].content.parts[0].text;
    
    // Try to parse JSON from response
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
    }

    console.warn('Unable to parse Gemini response. Using fallback analysis.');
    return {
      diagnosis: "Based on our conversation, I recommend consulting with a healthcare professional for a proper diagnosis.",
      healthPlan: [
        { day: 1, title: "Day 1 - Rest and Hydration", activities: ["Get adequate rest", "Stay hydrated", "Monitor symptoms"] },
        { day: 2, title: "Day 2 - Gentle Activity", activities: ["Light walking", "Continue hydration", "Rest as needed"] },
        { day: 3, title: "Day 3 - Gradual Return", activities: ["Moderate activity", "Healthy eating", "Good sleep"] },
        { day: 4, title: "Day 4 - Normal Routine", activities: ["Regular exercise", "Balanced diet", "Stress management"] },
        { day: 5, title: "Day 5 - Wellness Focus", activities: ["Physical activity", "Mental wellness", "Social connection"] },
        { day: 6, title: "Day 6 - Health Maintenance", activities: ["Exercise routine", "Healthy habits", "Preventive care"] },
        { day: 7, title: "Day 7 - Long-term Health", activities: ["Sustain healthy lifestyle", "Regular check-ups", "Wellness practices"] }
      ],
      recommendations: [
        {
          category: "Lifestyle",
          dos: ["Get 7-9 hours of sleep", "Exercise regularly", "Manage stress"],
          donts: ["Avoid excessive screen time", "Don't skip meals", "Avoid sedentary lifestyle"]
        },
        {
          category: "Diet",
          dos: ["Eat balanced meals", "Stay hydrated", "Include fruits and vegetables"],
          donts: ["Avoid processed foods", "Don't skip breakfast", "Limit sugary drinks"]
        }
      ],
      medications: [
        {
          name: "Consult your doctor",
          dosage: "As prescribed",
          frequency: "As needed",
          duration: "Until symptoms improve"
        }
      ]
    };
  } catch (error) {
    console.error('Gemini API error:', error);
    console.warn('Using fallback analysis due to API error.');
    return {
      diagnosis: "Based on our conversation, I recommend consulting with a healthcare professional for a proper diagnosis.",
      healthPlan: [
        { day: 1, title: "Day 1 - Rest and Hydration", activities: ["Get adequate rest", "Stay hydrated", "Monitor symptoms"] },
        { day: 2, title: "Day 2 - Gentle Activity", activities: ["Light walking", "Continue hydration", "Rest as needed"] },
        { day: 3, title: "Day 3 - Gradual Return", activities: ["Moderate activity", "Healthy eating", "Good sleep"] },
        { day: 4, title: "Day 4 - Normal Routine", activities: ["Regular exercise", "Balanced diet", "Stress management"] },
        { day: 5, title: "Day 5 - Wellness Focus", activities: ["Physical activity", "Mental wellness", "Social connection"] },
        { day: 6, title: "Day 6 - Health Maintenance", activities: ["Exercise routine", "Healthy habits", "Preventive care"] },
        { day: 7, title: "Day 7 - Long-term Health", activities: ["Sustain healthy lifestyle", "Regular check-ups", "Wellness practices"] }
      ],
      recommendations: [
        {
          category: "Lifestyle",
          dos: ["Get 7-9 hours of sleep", "Exercise regularly", "Manage stress"],
          donts: ["Avoid excessive screen time", "Don't skip meals", "Avoid sedentary lifestyle"]
        },
        {
          category: "Diet",
          dos: ["Eat balanced meals", "Stay hydrated", "Include fruits and vegetables"],
          donts: ["Avoid processed foods", "Don't skip breakfast", "Limit sugary drinks"]
        }
      ],
      medications: [
        {
          name: "Consult your doctor",
          dosage: "As prescribed",
          frequency: "As needed",
          duration: "Until symptoms improve"
        }
      ]
    };
  }
};

// Browser speech synthesis fallback
export const simulateTextToSpeech = async (text: string): Promise<void> => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    const voices = speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') || 
      voice.name.includes('Microsoft') ||
      voice.lang.startsWith('en')
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    speechSynthesis.speak(utterance);
  }
  
  await new Promise(resolve => setTimeout(resolve, 1000));
};