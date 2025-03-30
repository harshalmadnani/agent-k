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

// AgentLauncher types
export interface AgentLauncherProps {
  onClose: () => void;
}

export interface Slide {
  image: string;
  title: string;
  content: string;
  hasForm?: boolean;
  hasUpload?: boolean;
  hasActivities?: boolean;
  hasDataSources?: boolean;
  hasPrompt?: boolean;
  hasModelSelection?: boolean;
  hasPostingConfig?: boolean;
  hasChatConfig?: boolean;
  hasXConfig?: boolean;
  hasExamples?: boolean;
  hasReview?: boolean;
  hasSuccess?: boolean;
  previewImage?: string;
  hasXLabel?: boolean;
  hasXExtension?: boolean;
  hasXDetails?: boolean;
}

export interface QA {
  question: string;
  answer: string;
}

export interface PostConfiguration {
  clients: string[];
  interval: number;
  topics: string;
  enabled: boolean;
}

export interface ChatConfiguration {
  clients: string[];
  reply_to_usernames: string[];
  reply_to_replies: boolean;
  enabled: boolean;
}

export interface TwitterCredentials {
  'TWITTER_USERNAME=': string;
  'TWITTER_PASSWORD=': string;
  'TWITTER_EMAIL=': string;
  'TWITTER_2FA_SECRET=': string;
}

export interface CharacterOption {
  value: string;
  label: string;
} 