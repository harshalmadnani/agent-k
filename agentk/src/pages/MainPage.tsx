import React, { useState } from 'react';
import styled from 'styled-components';
import Navbar from '../components/layout/Navbar';
import ChatInterface from '../components/chat/ChatInterface';
import Terminal from '../components/terminal/Terminal';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background-color: #121212;
`;

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const Section = styled.div<{ expanded: boolean }>`
  flex: ${props => props.expanded ? 3 : 1};
  min-width: 300px;
  transition: flex 0.3s ease;
  overflow: hidden;
  position: relative;
`;

const MainPage: React.FC = () => {
  const [activeView, setActiveView] = useState<'chat' | 'terminal'>('chat');
  const [selectedAgent, setSelectedAgent] = useState(38);
  
  const handleToggleView = (view: 'chat' | 'terminal') => {
    setActiveView(view);
  };
  
  const handleLogout = () => {
    console.log('Logout clicked');
    // Implement logout functionality
  };
  
  const handleCommand = (command: string) => {
    console.log('Command received:', command);
    // Handle any commands if needed
  };

  return (
    <PageContainer>
      <Navbar 
        activeView={activeView} 
        onToggleView={handleToggleView} 
        onLogout={handleLogout} 
      />
      <ContentContainer>
        {activeView === 'chat' ? (
          <Section expanded={true}>
            <ChatInterface onCommand={handleCommand} />
          </Section>
        ) : (
          <Section expanded={true}>
            <Terminal selectedAgent={selectedAgent} />
          </Section>
        )}
      </ContentContainer>
    </PageContainer>
  );
};

export default MainPage; 