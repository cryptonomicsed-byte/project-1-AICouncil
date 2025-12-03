/**
 * Chat Interface with Council Mode Integration
 * Task 7: Add ⚡ Council Mode toggle to OpenWebUI
 */

import React, { useState, useRef, useEffect } from 'react';
import useCouncil from '../hooks/useCouncil';
import CouncilVisualization from './CouncilVisualization';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'council';
  content: string;
  timestamp: Date;
  councilResult?: any;
}

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [councilMode, setCouncilMode] = useState(false);
  const [numAgents, setNumAgents] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [showCouncilPanel, setShowCouncilPanel] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { deliberate, loading: councilLoading, error: councilError } = useCouncil();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      if (councilMode) {
        // Run council deliberation
        const result = await deliberate(inputValue, undefined, numAgents);

        if (result) {
          const councilMessage: Message = {
            id: `msg-${Date.now()}`,
            role: 'council',
            content: result.chairman_summary,
            timestamp: new Date(),
            councilResult: result,
          };
          setMessages((prev) => [...prev, councilMessage]);
          setShowCouncilPanel(true);
        }
      } else {
        // Normal LiteLLM chat (simulate response)
        // In real implementation, this would call OpenAI-compatible API
        const assistantMessage: Message = {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: `This is a simulated response to: "${inputValue}"`,
          timestamp: new Date(),
        };
        
        // Simulate delay
        setTimeout(() => {
          setMessages((prev) => [...prev, assistantMessage]);
        }, 1000);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-dark-900">
      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        showCouncilPanel ? 'w-1/2' : 'w-full'
      }`}>
        {/* Header with Mode Toggle */}
        <div className="bg-dark-800 border-b border-dark-700 p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gradient">AICouncil</h1>
            <div className="flex items-center gap-3">
              {/* Council Mode Toggle */}
              <button
                onClick={() => setCouncilMode(!councilMode)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                  councilMode
                    ? 'bg-secondary-600 text-white shadow-glow-secondary'
                    : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                }`}
                title="Toggle Council Deliberation Mode"
              >
                <span className="text-lg">⚡</span>
                <span className="hidden sm:inline">Council Mode</span>
              </button>

              {/* Agent Count Slider (Council Mode) */}
              {councilMode && (
                <div className="flex items-center gap-2 bg-dark-700 px-3 py-2 rounded-lg">
                  <span className="text-sm text-dark-400">Agents:</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={numAgents}
                    onChange={(e) => setNumAgents(parseInt(e.target.value))}
                    className="w-20"
                  />
                  <span className="text-sm text-secondary-400 font-semibold w-4">
                    {numAgents}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Mode Indicator */}
          {councilMode && (
            <div className="text-sm text-secondary-300 bg-secondary-900/30 border border-secondary-700 rounded px-3 py-2">
              🏛️ Council Mode Enabled – Deliberation will involve {numAgents} AI agents
            </div>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <p className="text-4xl mb-4">💬</p>
                <h2 className="text-xl font-semibold text-dark-200 mb-2">
                  Start a Conversation
                </h2>
                <p className="text-dark-400 max-w-sm">
                  {councilMode
                    ? 'Ask a question for the council to deliberate on'
                    : 'Chat with Venice AI or local models'}
                </p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-2xl px-4 py-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-venice-700 text-white'
                      : message.role === 'council'
                      ? 'bg-secondary-900/40 border border-secondary-700'
                      : 'bg-dark-700 text-dark-100'
                  }`}
                >
                  {message.role === 'council' && (
                    <div className="text-secondary-300 font-semibold text-sm mb-2 flex items-center gap-2">
                      <span>👨‍⚖️</span>
                      <span>Chairman's Summary</span>
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <span className="text-xs text-dark-500 mt-2 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-dark-700 text-dark-100 px-4 py-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="animate-spin">⚙️</span>
                  <span>
                    {councilMode ? 'Council deliberating...' : 'Thinking...'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {councilError && (
            <div className="flex justify-start">
              <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-lg">
                <span className="font-semibold">Error:</span> {councilError}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-dark-800 border-t border-dark-700 p-4">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                councilMode
                  ? 'Ask the council...'
                  : 'Message Venice AI or local model...'
              }
              className="input flex-1"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="btn-primary px-6"
            >
              {isLoading ? '⏳' : '→'}
            </button>
          </form>
        </div>
      </div>

      {/* Council Visualization Panel */}
      {showCouncilPanel && messages.length > 0 && (
        <div className="w-1/2 bg-dark-800 border-l border-dark-700 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-secondary-300">
              Deliberation Results
            </h2>
            <button
              onClick={() => setShowCouncilPanel(false)}
              className="text-dark-400 hover:text-dark-200 transition-colors"
              title="Close panel"
            >
              ✕
            </button>
          </div>

          {messages
            .filter((msg) => msg.role === 'council' && msg.councilResult)
            .reverse()
            .map((message) => (
              <div key={message.id} className="space-y-4">
                <CouncilVisualization deliberation={message.councilResult} />
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
