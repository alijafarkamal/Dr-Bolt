import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clipboard, Pill, Brain, CheckCircle, FileDown, AlertTriangle, FlaskConical, HeartPulse, Bell, MessageCircle, BarChart3 } from 'lucide-react';
import { ConversationMessage } from '../types';
import { generateHealthAnalysis } from '../utils/apiUtils';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ResultsTabProps {
  conversationHistory: ConversationMessage[];
}

const ResultsTab: React.FC<ResultsTabProps> = ({ conversationHistory }) => {
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const performAnalysis = async () => {
      setIsAnalyzing(true);
      try {
        const result = await generateHealthAnalysis(conversationHistory);
        setAnalysisResult(result);
      } catch (error) {
        console.error('Error generating health analysis:', error);
        setAnalysisResult(null);
      } finally {
        setIsAnalyzing(false);
      }
    };
    performAnalysis();
  }, [conversationHistory]);

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('DrBolt-Health-Report.pdf');
  };

  if (isAnalyzing) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-12 border border-green-100 text-center">
          <Brain className="h-16 w-16 text-green-500 mx-auto mb-6 animate-pulse" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Dr. Bolt is analyzing your case...
          </h2>
          <p className="text-gray-600">
            Please wait while I process your consultation and prepare your personalized health plan.
          </p>
        </div>
      </div>
    );
  }

  if (!analysisResult) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-12 border border-red-100 text-center">
          <p className="text-red-600">Unable to generate analysis. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-end">
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-all"
        >
          <FileDown className="w-5 h-5" />
          Download PDF
        </button>
      </div>
      <div ref={reportRef} className="space-y-8">
        {/* Diagnosis Summary */}
        {analysisResult.diagnosisSummary && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
            <div className="flex items-center mb-6">
              <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">🧾 Diagnosis Summary</h2>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
              <p className="text-gray-800 text-lg leading-relaxed">{analysisResult.diagnosisSummary}</p>
            </div>
          </div>
        )}

        {/* Possible Underlying Conditions */}
        {Array.isArray(analysisResult.possibleUnderlyingConditions) && analysisResult.possibleUnderlyingConditions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
            <div className="flex items-center mb-6">
              <HeartPulse className="h-8 w-8 text-blue-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">🧠 Possible Underlying Conditions</h2>
            </div>
            <ul className="list-disc pl-6 text-gray-800 text-lg">
              {analysisResult.possibleUnderlyingConditions.map((cond: string, idx: number) => (
                <li key={idx}>{cond}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommended Lab Tests */}
        {Array.isArray(analysisResult.recommendedLabTests) && analysisResult.recommendedLabTests.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100">
            <div className="flex items-center mb-6">
              <FlaskConical className="h-8 w-8 text-purple-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">🔬 Recommended Lab Tests</h2>
            </div>
            <ul className="list-disc pl-6 text-gray-800 text-lg">
              {analysisResult.recommendedLabTests.map((test: string, idx: number) => (
                <li key={idx}>{test}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Lifestyle Modifications */}
        {Array.isArray(analysisResult.lifestyleModifications) && analysisResult.lifestyleModifications.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-orange-100">
            <div className="flex items-center mb-6">
              <AlertTriangle className="h-8 w-8 text-orange-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">🧘 Lifestyle Modifications</h2>
            </div>
            <ul className="list-disc pl-6 text-gray-800 text-lg">
              {analysisResult.lifestyleModifications.map((mod: string, idx: number) => (
                <li key={idx}>{mod}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Reminders/Alerts */}
        {Array.isArray(analysisResult.reminders) && analysisResult.reminders.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-yellow-100">
            <div className="flex items-center mb-6">
              <Bell className="h-8 w-8 text-yellow-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">⏰ Reminders & Alerts</h2>
            </div>
            <ul className="list-disc pl-6 text-gray-800 text-lg">
              {analysisResult.reminders.map((rem: string, idx: number) => (
                <li key={idx}>{rem}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Follow-up Questions */}
        {Array.isArray(analysisResult.followUpQuestions) && analysisResult.followUpQuestions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-cyan-100">
            <div className="flex items-center mb-6">
              <MessageCircle className="h-8 w-8 text-cyan-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">🧩 Follow-up Questions</h2>
            </div>
            <ul className="list-disc pl-6 text-gray-800 text-lg">
              {analysisResult.followUpQuestions.map((q: string, idx: number) => (
                <li key={idx}>{q}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Wellness Score / Risk Rating */}
        {analysisResult.wellnessScore && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-pink-100">
            <div className="flex items-center mb-6">
              <BarChart3 className="h-8 w-8 text-pink-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">📊 Wellness Score / Risk Rating</h2>
            </div>
            <div className="bg-gradient-to-r from-pink-50 to-yellow-50 rounded-xl p-6">
              <p className="text-lg font-semibold">{analysisResult.wellnessScore.score}</p>
              <p className="text-gray-700 mt-2">{analysisResult.wellnessScore.explanation}</p>
            </div>
          </div>
        )}

        {/* 7-Day Health Plan */}
        {Array.isArray(analysisResult.healthPlan) && analysisResult.healthPlan.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
            <div className="flex items-center mb-6">
              <Calendar className="h-8 w-8 text-blue-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">🗓️ 7-Day Health Plan</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {analysisResult.healthPlan.map((day: any) => (
                <div key={day.day} className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6 border border-blue-100">
                  <h3 className="font-bold text-blue-800 mb-3">Day {day.day}: {day.title}</h3>
                  <ul className="space-y-2">
                    {day.activities.map((activity: string, index: number) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        {activity}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {Array.isArray(analysisResult.recommendations) && analysisResult.recommendations.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
            <div className="flex items-center mb-6">
              <Clipboard className="h-8 w-8 text-green-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">📋 Recommendations</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {analysisResult.recommendations.map((rec: any, index: number) => (
                <div key={index} className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800 border-b border-green-200 pb-2">
                    {rec.category}
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Do's
                      </h4>
                      <ul className="space-y-2">
                        {rec.dos.map((item: string, idx: number) => (
                          <li key={idx} className="text-sm text-green-700 flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                      <h4 className="font-semibold text-red-800 mb-3 flex items-center">
                        <span className="h-4 w-4 mr-2">⚠️</span>
                        Don'ts
                      </h4>
                      <ul className="space-y-2">
                        {rec.donts.map((item: string, idx: number) => (
                          <li key={idx} className="text-sm text-red-700 flex items-start">
                            <span className="text-red-500 mr-2">✗</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Medications */}
        {Array.isArray(analysisResult.medications) && analysisResult.medications.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
            <div className="flex items-center mb-6">
              <Pill className="h-8 w-8 text-purple-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">💊 Simulated Medications</h2>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <p className="text-yellow-800 text-sm font-medium">
                ⚠️ These are AI-generated medication suggestions for demonstration purposes only. 
                Always consult a real healthcare provider before taking any medication.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {analysisResult.medications.map((med: any, index: number) => (
                <div key={index} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                  <h3 className="font-bold text-purple-800 text-lg mb-3">{med.name}</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium text-gray-700">Dosage:</span> {med.dosage}</p>
                    <p><span className="font-medium text-gray-700">Frequency:</span> {med.frequency}</p>
                    <p><span className="font-medium text-gray-700">Duration:</span> {med.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsTab;