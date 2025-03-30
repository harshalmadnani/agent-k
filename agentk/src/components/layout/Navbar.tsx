import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import AgentLauncher from '../agent-launcher';

const NavbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #000;
  color: white;
  border-bottom: 1px solid #3d3d3d;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LogoImage = styled.img`
  height: 40px;
  width: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const LogoText = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  color: #64ff64;
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ToggleButton = styled.button<{ active: boolean }>`
  background-color: ${props => props.active ? '#64ff64' : '#3d3d3d'};
  color: ${props => props.active ? '#000' : '#fff'};
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.active ? '#64ff64' : '#4a4a4a'};
  }
`;

const LogoutButton = styled.button`
  background-color: #3d3d3d;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #ff6464;
  }
`;

const RightContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const CreateAgentButton = styled(ToggleButton)`
  &:hover {
    background-color: ${props => props.active ? '#50cc50' : '#4a4a4a'};
  }
`;

interface NavbarProps {
  activeView: 'chat' | 'terminal' | 'agent';
  onToggleView: (view: 'chat' | 'terminal' | 'agent') => void;
  onLogout: () => void;
}

function Navbar({ activeView, onToggleView, onLogout }: NavbarProps): React.ReactElement {
  const [showLauncher, setShowLauncher] = useState<boolean>(false);

  // Synchronize showLauncher state with activeView
  useEffect(() => {
    if (activeView !== 'agent' && showLauncher) {
      setShowLauncher(false);
    }
  }, [activeView]);

  // Listen for navigateToChat event from AgentLauncher
  useEffect(() => {
    const handleNavigateToChat = () => {
      onToggleView('chat');
    };
    
    window.addEventListener('navigateToChat', handleNavigateToChat);
    
    return () => {
      window.removeEventListener('navigateToChat', handleNavigateToChat);
    };
  }, [onToggleView]);

  return (
    <>
      <NavbarContainer>
        <Logo>
          <LogoImage src="https://wbsnlpviggcnwqfyfobh.supabase.co/storage/v1/object/public/images/agent-images/1741589931523.png" alt="AgentK Logo" />
          <LogoText>AgentK</LogoText>
        </Logo>
        <RightContainer>
          <CreateAgentButton 
            active={activeView === 'agent'} 
            onClick={() => {
              setShowLauncher(true);
              onToggleView('agent');
            }}
          >
            Create Agent
          </CreateAgentButton>
          <ToggleContainer>
            <ToggleButton 
              active={activeView === 'chat'} 
              onClick={() => {
                setShowLauncher(false);
                onToggleView('chat');
              }}
            >
              Chat
            </ToggleButton>
            <ToggleButton 
              active={activeView === 'terminal'} 
              onClick={() => {
                setShowLauncher(false);
                onToggleView('terminal');
              }}
            >
              Terminal
            </ToggleButton>
          </ToggleContainer>
          <LogoutButton onClick={onLogout}>
            Logout
          </LogoutButton>
        </RightContainer>
      </NavbarContainer>
      {showLauncher && (
        <AgentLauncher onClose={() => setShowLauncher(false)} />
      )}
    </>
  );
}

export default Navbar; 