import React, { useRef } from 'react';
import TerminalUI from './TerminalUI';
import useTerminalLogic from '../../hooks/terminal/useTerminalLogic';
import { DEFAULT_AGENT_ID } from '../../utils/constants';

interface TerminalProps {
  selectedAgent?: number;
}

const Terminal: React.FC<TerminalProps> = ({ selectedAgent = DEFAULT_AGENT_ID }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const { history, agentNames } = useTerminalLogic({ 
    selectedAgent, 
    terminalRef 
  });

  return (
    <TerminalUI 
      ref={terminalRef}
      history={history}
      agentNames={agentNames}
    />
  );
};

export default Terminal; 