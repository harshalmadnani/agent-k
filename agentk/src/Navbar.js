import React from 'react';
import styled from 'styled-components';

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

const ToggleButton = styled.button`
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

function Navbar({ activeView, onToggleView }) {
  return (
    <NavbarContainer>
      <Logo>
        <LogoImage src="/agentk.png" alt="AgentK Logo" />
        <LogoText>AgentK</LogoText>
      </Logo>
      <ToggleContainer>
        <ToggleButton 
          active={activeView === 'chat'} 
          onClick={() => onToggleView('chat')}
        >
          Chat
        </ToggleButton>
        <ToggleButton 
          active={activeView === 'terminal'} 
          onClick={() => onToggleView('terminal')}
        >
          Terminal
        </ToggleButton>
      </ToggleContainer>
    </NavbarContainer>
  );
}

export default Navbar; 