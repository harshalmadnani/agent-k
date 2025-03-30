import { useState, useEffect, RefObject } from 'react';
import { Message } from '../../types';
import { fetchChatResponse } from '../../services/api';
import { DEFAULT_WELCOME_MESSAGE } from '../../utils/constants';

interface UseChatLogicProps {
  agentName?: string;
  chatHistoryRef: RefObject<HTMLDivElement | null>;
  onCommand: (command: string) => void;
}

const useChatLogic = ({ agentName, chatHistoryRef, onCommand }: UseChatLogicProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages, isLoading, chatHistoryRef]);

  // Add welcome message on component mount
  useEffect(() => {
    setMessages([
      { 
        text: agentName 
          ? `Hey there! I'm ${agentName}, your AI assistant. What can I help you with today?`
          : DEFAULT_WELCOME_MESSAGE, 
        isUser: false 
      }
    ]);
  }, [agentName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userInput = input;
    setMessages(prev => [...prev, { text: userInput, isUser: true }]);
    setInput('');
    setIsLoading(true);
    
    try {
      const responseText = await fetchChatResponse(userInput);
      setMessages(prev => [...prev, { text: responseText, isUser: false }]);
      onCommand(userInput);
    } catch (error) {
      console.error('Error fetching response:', error);
      setMessages(prev => [...prev, { 
        text: "yikes, network glitch. chainweb's probably just having a moment. try again?", 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return {
    messages,
    input,
    setInput,
    isLoading,
    handleSubmit,
    formatTimestamp
  };
};

export default useChatLogic; 