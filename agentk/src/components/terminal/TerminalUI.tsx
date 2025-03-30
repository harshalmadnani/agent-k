import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { TerminalEntry, AgentNames } from '../../types';

// Styled components
const Container = styled.div`
  height: 100%;
  background-color: #000;
  color: #fff;
  font-family: monospace;
  padding: 20px;
  overflow-y: auto;
`;

const Line = styled.div`
  margin-bottom: 16px;
  white-space: pre-wrap;
`;

const Command = styled(Line)`
  color: #64ff64;
  &::before {
    content: '> ';
  }
`;

const Output = styled(Line)`
  color: #fff;
`;

const Timestamp = styled.span`
  color: #666;
  margin-left: 10px;
  font-size: 12px;
`;

interface TerminalUIProps {
  history: TerminalEntry[];
  agentNames: AgentNames;
}

// Using forwardRef to pass the ref to the Container component
const TerminalUI = forwardRef<HTMLDivElement, TerminalUIProps>(
  ({ history, agentNames }, ref) => {
    return (
      <Container ref={ref}>
        {history.map((entry, index) => (
          <div key={index}>
            {entry.type === 'input' ? (
              <Command>{entry.content}</Command>
            ) : (
              <Output>
                <span style={{ color: '#64ff64' }}>
                  {entry.agentId ? `${agentNames[entry.agentId] || `Agent ${entry.agentId}`}: ` : ''}
                </span>
                {entry.content}
                {entry.timestamp && (
                  <Timestamp>{entry.timestamp.toLocaleString()}</Timestamp>
                )}
              </Output>
            )}
          </div>
        ))}
      </Container>
    );
  }
);

// Add display name for better debugging
TerminalUI.displayName = 'TerminalUI';

export default TerminalUI;
