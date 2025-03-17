import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

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

const Message = styled.div`
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

function ChatInterface({ onCommand }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatHistoryRef = React.useRef(null);

  // Auto-scroll to bottom when messages change
  React.useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Add welcome message on component mount
  React.useEffect(() => {
    setMessages([
      { 
        text: "Hey there! I'm AgentK, your Kadena ecosystem guide. What can I help you with today?", 
        isUser: false 
      }
    ]);
  }, []);

  const handleSubmit = async (e) => {
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

  return (
    <Container>
      <ChatHistory ref={chatHistoryRef}>
        {messages.map((message, index) => (
          <MessageContainer key={index}>
            <MessageHeader>
              {message.isUser ? 'You' : 'AgentK'} • {formatTimestamp()}
            </MessageHeader>
            <Message isUser={message.isUser}>
              {message.text}
            </Message>
          </MessageContainer>
        ))}
        {isLoading && (
          <MessageContainer>
            <MessageHeader>
              AgentK • {formatTimestamp()}
            </MessageHeader>
            <Message isUser={false}>
              <LoadingDots>
                <span></span>
                <span></span>
                <span></span>
              </LoadingDots>
            </Message>
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
}

export default ChatInterface;