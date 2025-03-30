import { useState } from 'react';
import { QA } from '../../types';

export const useAgentState = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [agentName, setAgentName] = useState('');
  const [agentDescription, setAgentDescription] = useState('');
  const [agentImage, setAgentImage] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isImprovingPrompt, setIsImprovingPrompt] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState('presets');
  const [selectedPreset, setSelectedPreset] = useState('');
  const [setupX, setSetupX] = useState(false);
  const [postingClients, setPostingClients] = useState<string[]>([]);
  const [postingInterval, setPostingInterval] = useState('60');
  const [postingTopics, setPostingTopics] = useState('');
  const [chatClients, setChatClients] = useState<string[]>([]);
  const [replyToUsernames, setReplyToUsernames] = useState<string[]>([]);
  const [replyToReplies, setReplyToReplies] = useState(false);
  const [exampleQueries, setExampleQueries] = useState('');
  const [examplePosts, setExamplePosts] = useState('');
  const [qaList, setQaList] = useState<QA[]>([]);
  const [postList, setPostList] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [currentPost, setCurrentPost] = useState('');
  const [twitterUsername, setTwitterUsername] = useState('');
  const [twitterPassword, setTwitterPassword] = useState('');
  const [twitterEmail, setTwitterEmail] = useState('');
  const [twitter2FASecret, setTwitter2FASecret] = useState('');
  const [currentUsername, setCurrentUsername] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4o');

  return {
    currentStep, setCurrentStep,
    agentName, setAgentName,
    agentDescription, setAgentDescription,
    agentImage, setAgentImage,
    searchTerm, setSearchTerm,
    selectedSources, setSelectedSources,
    selectedActivities, setSelectedActivities,
    isCreating, setIsCreating,
    isImprovingPrompt, setIsImprovingPrompt,
    prompt, setPrompt,
    selectedCharacter, setSelectedCharacter,
    selectedPreset, setSelectedPreset,
    setupX, setSetupX,
    postingClients, setPostingClients,
    postingInterval, setPostingInterval,
    postingTopics, setPostingTopics,
    chatClients, setChatClients,
    replyToUsernames, setReplyToUsernames,
    replyToReplies, setReplyToReplies,
    exampleQueries, setExampleQueries,
    examplePosts, setExamplePosts,
    qaList, setQaList,
    postList, setPostList,
    currentQuestion, setCurrentQuestion,
    currentAnswer, setCurrentAnswer,
    currentPost, setCurrentPost,
    twitterUsername, setTwitterUsername,
    twitterPassword, setTwitterPassword,
    twitterEmail, setTwitterEmail,
    twitter2FASecret, setTwitter2FASecret,
    currentUsername, setCurrentUsername,
    selectedModel, setSelectedModel
  };
};

export const loadingAnimation = {
  display: 'inline-block',
  width: '20px',
  height: '20px',
  marginLeft: '10px',
  border: '3px solid rgba(0, 0, 0, 0.3)',
  borderRadius: '50%',
  borderTopColor: '#000',
  animation: 'spin 1s ease-in-out infinite',
  verticalAlign: 'middle'
} as React.CSSProperties; 