import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-green-100">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src="/ChatGPT Image Jun 27, 2025, 11_35_30 PM.png" 
            alt="Dr. Bolt Logo" 
            className="h-16 w-auto sm:h-20 md:h-24 lg:h-28 rounded-2xl hover:scale-110 hover:shadow-lg transition-all duration-300 cursor-pointer"
          />
        </div>
        
        <div className="flex items-center">
          <img 
            src="/black_circle_360x360.png"
            alt="Bolt Badge"
            className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 cursor-pointer"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;