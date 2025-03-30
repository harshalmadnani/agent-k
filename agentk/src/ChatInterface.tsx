import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';
import ChatUI from './ChatUI';
import useChatLogic from './useChatLogic';

interface ChatInterfaceProps {
  onCommand: (command: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onCommand }) => {
  const { agentName } = useParams<{ agentName?: string }>();
  const chatHistoryRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    input,
    setInput,
    isLoading,
    handleSubmit,
    formatTimestamp
  } = useChatLogic({ 
    agentName, 
    chatHistoryRef, 
    onCommand 
  });

  return (
    <ChatUI
      messages={messages}
      input={input}
      isLoading={isLoading}
      chatHistoryRef={chatHistoryRef}
      formatTimestamp={formatTimestamp}
      handleSubmit={handleSubmit}
      setInput={setInput}
    />
  );
};

export default ChatInterface; 