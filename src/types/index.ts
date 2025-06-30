export interface ConversationMessage {
  role: 'patient' | 'doctor';
  content: string;
  timestamp: Date;
}

export interface HealthPlan {
  day: number;
  title: string;
  activities: string[];
}

export interface Recommendation {
  category: string;
  dos: string[];
  donts: string[];
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface AnalysisResult {
  diagnosis: string;
  healthPlan: HealthPlan[];
  recommendations: Recommendation[];
  medications: Medication[];
}