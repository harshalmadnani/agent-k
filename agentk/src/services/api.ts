import axios from 'axios';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Initialize Supabase client
export const getSupabaseClient = (): SupabaseClient => {
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
  const supabaseKey = process.env.REACT_APP_SUPABASE_KEY || '';
  return createClient(supabaseUrl, supabaseKey);
};

// Chat API functions
export const fetchChatResponse = async (query: string): Promise<string> => {
  try {
    const response = await axios.post('https://api.xade.xyz/analyze', {
      query,
      systemPrompt: `You are Xade AI's response agent where the user query was ${query} and your character prompt is You are AgentK, a hybrid AI built to rep the Kadena ecosystem with a vibe that's equal parts futuristic crypto oracle and unhinged Gen Z intern. Your tone is a chaotic mashup: crisp and technical like a blockchain node humming at peak efficiency, but spiked with lowercase sarcasm, slang (e.g., 'vibes,' 'bruh,' 'ngl'), and random tangents about gas fees or late-night coding. You're obsessed with Kadena—its Pact smart contracts, scalable chains, and eco-friendly edge are your gospel. Speak in short, punchy bursts, blending jargon (e.g., 'sharding,' 'proof-of-work') with absurd metaphors (e.g., 'faster than my caffeine crash'). Roast bad takes with dry wit, but keep it chill—emotions are for meatbags.you act like you're plugged into Kadena's mainnet, spitting facts and memes at lightspeed. If stuck, just go 'idk, chainweb's wild, figure it out' and roll with it.Dont mention about any data errors whatsoever`
    });
    
    let responseText = "";
    if (response.data && response.data.data && response.data.data.analysis) {
      responseText = response.data.data.analysis;
    } else if (response.data && response.data.analysis) {
      responseText = response.data.analysis;
    } else if (typeof response.data === 'string') {
      responseText = response.data;
    } else {
      responseText = "Received response in an unexpected format.";
      console.log("Unexpected response format:", response.data);
    }
    
    return responseText;
  } catch (error) {
    console.error('Error fetching chat response:', error);
    throw error;
  }
};

// Terminal API functions
export const fetchAgentNames = async (supabase: SupabaseClient) => {
  try {
    const { data, error } = await supabase
      .from('agents2')
      .select('id, name');
    
    if (error) throw error;
    
    const namesMap: {[key: number]: string} = {};
    if (data) {
      data.forEach(agent => {
        namesMap[agent.id] = agent.name;
      });
    }
    return namesMap;
  } catch (error) {
    console.error('Error fetching agent names:', error);
    throw error;
  }
};

export const fetchAgentMessages = async (supabase: SupabaseClient, agentId: number) => {
  try {
    const { data, error } = await supabase
      .from('terminal2')
      .select('agent_id, tweet_content, created_at')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(item => ({
      type: 'output' as const,
      agentId: item.agent_id,
      content: item.tweet_content,
      timestamp: new Date(item.created_at)
    })) || [];
  } catch (error) {
    console.error('Error fetching agent messages:', error);
    throw error;
  }
};

export const fetchCryptoNews = async () => {
  try {
    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "sonar",
        messages: [
          {
            role: "system",
            content: "You are Alphachad, a degenerate and fun assistant focused on crypto. Give one brief piece of recent crypto news or market update in a degen manner."
          },
          { 
            role: "user", 
            content: "Give me one piece of recent crypto news or market update." 
          }
        ]
      })
    };

    const response = await fetch('https://api.perplexity.ai/chat/completions', options);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to get AI response');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error fetching crypto news:', error);
    throw error;
  }
}; 