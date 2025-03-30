import React, { useRef } from 'react';
import ChatUI from './ChatUI';
import useChatLogic from '../../hooks/chat/useChatLogic';
import { APP_NAME } from '../../utils/constants';

interface ChatInterfaceProps {
  onCommand?: (command: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onCommand = () => {} }) => {
  const chatHistoryRef = useRef<HTMLDivElement>(null);
  const chatLogic = useChatLogic({ 
    agentName: APP_NAME,
    chatHistoryRef,
    onCommand
  });

  return <ChatUI {...chatLogic} chatHistoryRef={chatHistoryRef} />;
};

export default ChatInterface; 