import React from 'react';
import { AlertTriangle } from 'lucide-react';

const Disclaimer: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 flex-shrink-0" />
          <p className="text-sm text-yellow-800 font-medium">
            <strong>Disclaimer:</strong> This is a demo AI medical assistant, not a licensed doctor. 
            Do not use this for real medical advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;