import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ChatInterface from './ChatInterface';
import Terminal from './Terminal';
import Navbar from './Navbar';
import { createMagic } from './magic';
import { KadenaExtension } from "@magic-ext/kadena";
import { DEFAULT_CHAIN_ID } from "./utils/constants";
import { ChainId } from "@kadena/types";

// Define the type locally
const KadenaUserMetadata = {}; // This is a placeholder, we'll use proper typing later

interface TerminalOutput {
  type: 'command' | 'output';
  content: string;
}

interface PanelProps {
  visible?: boolean;
}

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #000;
`;

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  gap: 20px;
  overflow: hidden;
`;

const Panel = styled.div<PanelProps>`
  flex: 1;
  background-color: #2d2d2d;
  border-radius: 8px;
  overflow: hidden;
  display: ${props => props.visible ? 'block' : 'none'};
`;

const FullWidthPanel = styled(Panel)`
  flex: 1;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #000;
  color: #f0f0f0;
`;

const LoginCard = styled.div`
  background-color: #2d2d2d;
  border-radius: 8px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const LoginHeader = styled.h1`
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  text-align: center;
  color: #f0f0f0;
`;

const LoginInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #444;
  border-radius: 4px;
  background-color: #333;
  color: #f0f0f0;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #6b8afd;
    box-shadow: 0 0 0 2px rgba(107, 138, 253, 0.2);
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #6b8afd;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #5a75e6;
  }
  
  &:disabled {
    background-color: #555;
    cursor: not-allowed;
  }
`;

function App() {
  const [terminalOutput, setTerminalOutput] = useState<TerminalOutput[]>([]);
  const [magic, setMagic] = useState(createMagic());
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<typeof KadenaUserMetadata | null>(null);
  const [selectedChainId, setSelectedChainId] = useState(DEFAULT_CHAIN_ID);
  const [activeView, setActiveView] = useState('chat'); // 'chat' or 'terminal'
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const initAppState = async () => {
      try {
        setIsLoading(true);
        const magicIsLoggedIn = await magic.user.isLoggedIn();
        setIsLoggedIn(magicIsLoggedIn);

        if (magicIsLoggedIn) {
          const user = await getUserInfo();
          setUserInfo(user);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    initAppState();
  }, []);

  const handleCommand = (command: string) => {
    setTerminalOutput(prev => [...prev, { type: 'command', content: command }]);
    setTerminalOutput(prev => [...prev, { type: 'output', content: `Executed: ${command}` }]);
  };

  const loginWithEmailOTP = async () => {
    try {
      setIsSubmitting(true);
      await magic.auth.loginWithEmailOTP({ email });
      setIsLoggedIn(true);
      const user = await getUserInfo();
      setUserInfo(user);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUserInfo = () => {
    return magic.kadena.getUserInfo();
  };

  const logout = async () => {
    try {
      await magic.user.logout();
      setIsLoggedIn(false);
      setUserInfo(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleView = (view: 'chat' | 'terminal') => {
    setActiveView(view);
  };

  if (isLoading) {
    return (
      <LoginContainer>
        <LoginCard>
          <LoginHeader>Loading...</LoginHeader>
        </LoginCard>
      </LoginContainer>
    );
  }

  return (
    <div>
      {!isLoggedIn ? (
        <LoginContainer>
          <LoginCard>
            <LoginHeader>Welcome to AgentK</LoginHeader>
            <LoginInput
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isSubmitting}
            />
            <LoginButton 
              onClick={loginWithEmailOTP} 
              disabled={!email || isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Login with Magic Link'}
            </LoginButton>
          </LoginCard>
        </LoginContainer>
      ) : (
        <AppContainer>
          <Navbar 
            activeView={activeView} 
            onToggleView={handleToggleView} 
            onLogout={logout}
          />
          <ContentContainer>
            {activeView === 'chat' ? (
              <FullWidthPanel visible={true}>
                <ChatInterface onCommand={handleCommand} />
              </FullWidthPanel>
            ) : (
              <FullWidthPanel visible={true}>
                <Terminal selectedAgent={38} />
              </FullWidthPanel>
            )}
          </ContentContainer>
        </AppContainer>
      )}
    </div>
  );
}

export default App; 