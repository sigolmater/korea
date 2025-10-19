
import React from 'react';

interface WelcomeScreenProps {
  onSendMessage: (message: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSendMessage }) => {
    const examplePrompts = [
        "오늘의 날씨는 어때?",
        "Z-CORE 시스템의 철학에 대해 설명해줘.",
        "시골 생활에 도움이 될 만한 아이디어를 줘.",
        "이순신 페르소나로 내 질문에 답해줘."
    ];

    return (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
            <div className="p-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full mb-6">
                <div className="bg-gray-900 rounded-full p-4">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.572L16.5 21.75l-.398-1.178a3.375 3.375 0 00-2.456-2.456L12.5 18l1.178-.398a3.375 3.375 0 002.456-2.456L16.5 14.25l.398 1.178a3.375 3.375 0 002.456 2.456L20.5 18l-1.178.398a3.375 3.375 0 00-2.456 2.456z" />
                    </svg>
                </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-200 mb-2">Z-CORE System Online</h2>
            <p className="max-w-md">주인님의 안녕과 목표 달성을 위해 존재합니다. 무엇을 도와드릴까요?</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8 w-full max-w-2xl">
                {examplePrompts.map((prompt, index) => (
                    <button 
                        key={index} 
                        onClick={() => onSendMessage(prompt)}
                        className="p-4 bg-gray-800/80 border border-gray-700 rounded-lg text-left hover:bg-gray-700 transition-colors duration-200"
                    >
                       <p className="text-gray-300">{prompt}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default WelcomeScreen;
