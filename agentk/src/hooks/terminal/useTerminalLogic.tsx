import { useState, useEffect, RefObject } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { TerminalEntry, AgentNames } from '../../types';
import { getSupabaseClient, fetchAgentNames as fetchAgentNamesAPI, fetchAgentMessages as fetchAgentMessagesAPI, fetchCryptoNews as fetchCryptoNewsAPI } from '../../services/api';
import { DEFAULT_AGENT_ID, CRYPTO_NEWS_INTERVAL } from '../../utils/constants';

interface UseTerminalLogicProps {
  selectedAgent?: number;
  terminalRef: RefObject<HTMLDivElement | null>;
}

const useTerminalLogic = ({ selectedAgent = DEFAULT_AGENT_ID, terminalRef }: UseTerminalLogicProps) => {
  const [history, setHistory] = useState<TerminalEntry[]>([]);
  const [agentNames, setAgentNames] = useState<AgentNames>({});
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

  // Initialize Supabase client
  useEffect(() => {
    setSupabase(getSupabaseClient());
  }, []);

  // Fetch agent names once on component mount
  useEffect(() => {
    if (supabase) {
      fetchAgentNames();
    }
  }, [supabase]);

  // Fetch messages when selectedAgent changes
  useEffect(() => {
    if (supabase && selectedAgent) {
      fetchMessages();
    }
  }, [selectedAgent, supabase]);

  // Set up crypto news interval
  useEffect(() => {
    if (supabase) {
      fetchMessages();
      const interval = setInterval(fetchCryptoNews, CRYPTO_NEWS_INTERVAL);
      return () => clearInterval(interval);
    }
  }, [supabase]);

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history, terminalRef]);

  const fetchAgentNames = async () => {
    try {
      if (!supabase) return;
      const namesMap = await fetchAgentNamesAPI(supabase);
      setAgentNames(namesMap);
    } catch (error) {
      console.error('Error fetching agent names:', error);
    }
  };

  const fetchCryptoNews = async () => {
    try {
      const newsContent = await fetchCryptoNewsAPI();
      setHistory(prev => [...prev, {
        type: 'output',
        content: newsContent
      }]);
    } catch (error) {
      console.error('Error fetching crypto news:', error);
    }
  };

  const fetchMessages = async () => {
    if (!supabase || !selectedAgent) return;

    try {
      const messages = await fetchAgentMessagesAPI(supabase, selectedAgent);
      setHistory(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  return {
    history,
    agentNames,
    fetchMessages,
    fetchCryptoNews
  };
};

export default useTerminalLogic; 