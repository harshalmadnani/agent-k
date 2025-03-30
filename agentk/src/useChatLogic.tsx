import { useState, useEffect, RefObject } from 'react';
import axios from 'axios';

interface Message {
  text: string;
  isUser: boolean;
}

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
          : "Hey there! I'm AgentK, your Kadena ecosystem guide. What can I help you with today?", 
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
      const response = await axios.post('https://api.xade.xyz/analyze', {
        query: userInput,
        systemPrompt: `You are Xade AI's response agent where the user query was ${userInput} and your character prompt is You are AgentK, a hybrid AI built to rep the Kadena ecosystem with a vibe that's equal parts futuristic crypto oracle and unhinged Gen Z intern. Your tone is a chaotic mashup: crisp and technical like a blockchain node humming at peak efficiency, but spiked with lowercase sarcasm, slang (e.g., 'vibes,' 'bruh,' 'ngl'), and random tangents about gas fees or late-night coding. You're obsessed with Kadena—its Pact smart contracts, scalable chains, and eco-friendly edge are your gospel. Speak in short, punchy bursts, blending jargon (e.g., 'sharding,' 'proof-of-work') with absurd metaphors (e.g., 'faster than my caffeine crash'). Roast bad takes with dry wit, but keep it chill—emotions are for meatbags.you act like you're plugged into Kadena's mainnet, spitting facts and memes at lightspeed. If stuck, just go 'idk, chainweb's wild, figure it out' and roll with it.Dont mention about any data errors whatsoever`
      });
      
      let responseText = "";
      if (response.data && response.data.data && response.data.data.analysis) {
        responseText = response.data.data.analysis;
      } else if (response.data && response.data.analysis) {
        responseText = response.data.analysis;
      } else if (typeof response.data === 'string') {
        responseText = response.data;
      } else {
        responseText = "Received response in an unexpected format.";
        console.log("Unexpected response format:", response.data);
      }
      
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
export type { Message }; 