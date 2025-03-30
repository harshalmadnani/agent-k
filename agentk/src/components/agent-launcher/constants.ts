import { CharacterOption, Slide } from '../../types';

export const characterOptions: CharacterOption[] = [
  { value: 'presets', label: 'Presets' },
  { value: 'username', label: 'X username' },
  { value: 'prompt', label: 'From Prompt' }
];

export const dataSources: string[] = [
  'Market data',
  'Social sentiment',
  'News feeds',
  'Financial reports',
  'Trading signals',
  'Economic indicators',
  'Company filings',
  'Technical analysis'
];

export const slides: Slide[] = [
  { 
    image: 'https://wbsnlpviggcnwqfyfobh.supabase.co/storage/v1/object/public/app//picture.png', 
    title: 'Create your own\nAI-agent in a few clicks', 
    content: 'Launch and scale your AI-Agents with unprecedented ease and speed' 
  },
  { 
    image: 'https://wbsnlpviggcnwqfyfobh.supabase.co/storage/v1/object/public/app//picture2.png', 
    title: 'It all starts with a name', 
    content: 'How should we call your Agent?',
    hasForm: true 
  },
  { 
    image: 'https://wbsnlpviggcnwqfyfobh.supabase.co/storage/v1/object/public/app//picture3.png', 
    title: `Let's upload the picture\nof your agent`, 
    content: '',
    hasUpload: true 
  },
  { 
    image: 'https://wbsnlpviggcnwqfyfobh.supabase.co/storage/v1/object/public/app//picture7.png', 
    title: `What kind of activity do you want\nyour agent to do?`, 
    content: '',
    hasActivities: true 
  },
  { 
    image: 'https://wbsnlpviggcnwqfyfobh.supabase.co/storage/v1/object/public/app//picture10.png', 
    title: `Posting Configuration`, 
    content: 'Configure how your agent will post content',
    hasPostingConfig: true 
  },
  { 
    image: 'https://wbsnlpviggcnwqfyfobh.supabase.co/storage/v1/object/public/app//picture12.png', 
    title: `Chat and Interaction Configuration`, 
    content: 'Configure how your agent will interact with others',
    hasChatConfig: true 
  },
  { 
    image: 'https://wbsnlpviggcnwqfyfobh.supabase.co/storage/v1/object/public/app//picture5.png', 
    title: `What data sources do you want\nyour agent to use?`, 
    content: 'You can search for actions and sources',
    hasDataSources: true 
  },
  { 
    image: 'https://wbsnlpviggcnwqfyfobh.supabase.co/storage/v1/object/public/app//picture4.png', 
    title: `How do you want your agent to sound?`, 
    content: 'Enter the prompt',
    hasPrompt: true 
  },
  {
    image: 'https://wbsnlpviggcnwqfyfobh.supabase.co/storage/v1/object/public/app//picture4.png',
    title: 'Choose the Language Model',
    content: 'Select which LLM you want to power your agent',
    hasModelSelection: true
  },
  {
    image: 'https://wbsnlpviggcnwqfyfobh.supabase.co/storage/v1/object/public/app//picture11.png',
    title: `Let's see some examples from your agent`,
    content: 'Add example interactions and posts',
    hasExamples: true
  },
  { 
    image: 'https://wbsnlpviggcnwqfyfobh.supabase.co/storage/v1/object/public/app//picture6.png', 
    title: `Would you like to\nconfigure X account\nfor your agent now?`, 
    content: '',
    hasXConfig: true 
  },
  {
    image: 'https://wbsnlpviggcnwqfyfobh.supabase.co/storage/v1/object/public/app//picture10.png',
    title: 'Review',
    content: '',
    hasReview: true
  },
  {
    image: 'https://wbsnlpviggcnwqfyfobh.supabase.co/storage/v1/object/public/app//picture11.png',
    title: `Your agent is live`,
    content: 'Congratulations, you\'ve just created a new agent!',
    hasSuccess: true
  }
]; 