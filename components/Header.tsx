
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 p-4 shadow-lg sticky top-0 z-10">
      <div className="container mx-auto flex items-center justify-center">
        <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded-full bg-cyan-400 animate-pulse"></div>
            <h1 className="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            Z-CORE AI
            </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
