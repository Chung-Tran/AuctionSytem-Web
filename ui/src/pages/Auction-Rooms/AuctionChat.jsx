import React, { useState, useEffect } from 'react';

export default function AuctionChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            const newMessage = {
                id: Date.now(),
                sender: `User${Math.floor(Math.random() * 100)}`,
                content: `Message ${messages.length + 1}`
            };
            setMessages(prevMessages => [...prevMessages, newMessage]);
            if (!isOpen) {
                setUnreadCount(prevCount => prevCount + 1);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [isOpen, messages.length]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setUnreadCount(0);
        }
    };

    return (
        <React.Fragment>
            <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255, 255, 255, 0.5);
        }
      `}</style>
            <button
                className="fixed bottom-4 left-4 z-50 p-2 rounded-full border border-gray-300 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 outline-0"
                onClick={toggleChat}
            >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>
            {isOpen && (
                <div className="fixed bottom-16 left-4 w-[500px] h-[300px] bg-black bg-opacity-50 text-white rounded-lg overflow-hidden z-40 flex flex-col">
                    <div className="flex justify-between items-center p-2 bg-gray-800">
                        <h3 className="font-bold">Chat</h3>
                        <button
                            onClick={toggleChat}
                            className="text-white hover:text-gray-300 focus:outline-none"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex-1 p-2 overflow-y-auto custom-scrollbar">
                        {messages.map((message) => (
                            <div key={message.id} className="mb-2">
                                <span className="font-bold">{message.sender}: </span>
                                <span>{message.content}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </React.Fragment>
    );
}