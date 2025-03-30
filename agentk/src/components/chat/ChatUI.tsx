import React from 'react';
import styled from 'styled-components';
import { Message } from '../../types';

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #121212;
  font-family: 'Inter', sans-serif;
`;

const ChatHistory = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  color: #fff;
  scroll-behavior: smooth;
`;

const InputContainer = styled.div`
  padding: 15px 20px;
  border-top: 1px solid #2a2a2a;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  background-color: #2a2a2a;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #6b46c1;
    background-color: #333;
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SendButton = styled.button`
  background-color: #6b46c1;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 15px;
  margin-left: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: #805ad5;
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const MessageUI = styled.div<{ isUser: boolean }>`
  margin-bottom: 15px;
  padding: 12px 16px;
  background-color: ${props => props.isUser ? '#4a4a4a' : '#2d2d2d'};
  border-radius: 12px;
  border-top-right-radius: ${props => props.isUser ? '4px' : '12px'};
  border-top-left-radius: ${props => !props.isUser ? '4px' : '12px'};
  max-width: 85%;
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  word-break: break-word;
  line-height: 1.5;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    width: 10px;
    height: 10px;
    ${props => props.isUser 
      ? 'right: -5px; background: radial-gradient(circle at top left, transparent 70%, #4a4a4a 0);' 
      : 'left: -5px; background: radial-gradient(circle at top right, transparent 70%, #2d2d2d 0);'}
  }
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 10px;
`;

const MessageHeader = styled.div`
  font-size: 12px;
  color: #aaa;
  margin-bottom: 4px;
  font-weight: 500;
`;

const LoadingDots = styled.div`
  display: inline-flex;
  align-items: center;
  
  span {
    width: 6px;
    height: 6px;
    margin: 0 2px;
    background-color: #fff;
    border-radius: 50%;
    display: inline-block;
    animation: bounce 1.4s infinite ease-in-out both;
    
    &:nth-child(1) {
      animation-delay: -0.32s;
    }
    
    &:nth-child(2) {
      animation-delay: -0.16s;
    }
  }
  
  @keyframes bounce {
    0%, 80%, 100% { 
      transform: scale(0);
    } 
    40% { 
      transform: scale(1.0);
    }
  }
`;

interface ChatUIProps {
  messages: Message[];
  input: string;
  isLoading: boolean;
  chatHistoryRef: React.RefObject<HTMLDivElement | null>;
  formatTimestamp: () => string;
  handleSubmit: (e: React.FormEvent) => void;
  setInput: (value: string) => void;
}

const ChatUI: React.FC<ChatUIProps> = ({ 
  messages, 
  input, 
  isLoading, 
  chatHistoryRef, 
  formatTimestamp, 
  handleSubmit, 
  setInput 
}) => {
  return (
    <Container>
      <ChatHistory ref={chatHistoryRef}>
        {messages.map((message, index) => (
          <MessageContainer key={index}>
            <MessageHeader>
              {message.isUser ? 'You' : 'AgentK'} • {formatTimestamp()}
            </MessageHeader>
            <MessageUI isUser={message.isUser}>
              {message.text}
            </MessageUI>
          </MessageContainer>
        ))}
        {isLoading && (
          <MessageContainer>
            <MessageHeader>
              AgentK • {formatTimestamp()}
            </MessageHeader>
            <MessageUI isUser={false}>
              <LoadingDots>
                <span></span>
                <span></span>
                <span></span>
              </LoadingDots>
            </MessageUI>
          </MessageContainer>
        )}
      </ChatHistory>
      <InputContainer>
        <form onSubmit={handleSubmit} style={{ display: 'flex', width: '100%' }}>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AgentK something..."
            disabled={isLoading}
          />
          <SendButton type="submit" disabled={isLoading || !input.trim()}>
            Send
          </SendButton>
        </form>
      </InputContainer>
    </Container>
  );
};

export default ChatUI; 