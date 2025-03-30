// Chat types
export interface Message {
  text: string;
  isUser: boolean;
}

// Terminal types
export interface TerminalEntry {
  type: 'input' | 'output';
  content: string;
  agentId?: number;
  timestamp?: Date;
}

export interface AgentNames {
  [key: number]: string;
} 