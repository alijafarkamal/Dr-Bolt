import React, { useState } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import HomeTab from './components/HomeTab';
import ResultsTab from './components/ResultsTab';
import ContactTab from './components/ContactTab';
import Disclaimer from './components/Disclaimer';
import { ConversationMessage } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'results' | 'contact'>('home');
  const [resultsUnlocked, setResultsUnlocked] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const [nickname, setNickname] = useState<string>('');

  const unlockResults = () => {
    setResultsUnlocked(true);
    setActiveTab('results');
  };

  const addToConversation = (message: ConversationMessage) => {
    setConversationHistory(prev => [...prev, message]);
  };

  const resetConversation = () => {
    setConversationHistory([]);
    setNickname('');
    setResultsUnlocked(false);
    setActiveTab('home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      <Header />
      <Disclaimer />
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        resultsUnlocked={resultsUnlocked}
      />
      
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {activeTab === 'home' && (
          <HomeTab
            conversationHistory={conversationHistory}
            addToConversation={addToConversation}
            nickname={nickname}
            setNickname={setNickname}
            onUnlockResults={unlockResults}
            onResetConversation={resetConversation}
          />
        )}
        
        {activeTab === 'results' && resultsUnlocked && (
          <ResultsTab conversationHistory={conversationHistory} />
        )}
        
        {activeTab === 'contact' && <ContactTab />}
      </main>
    </div>
  );
}

export default App;