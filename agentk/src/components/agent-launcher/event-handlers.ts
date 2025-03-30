import { Dispatch, SetStateAction, RefObject } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { QA, TwitterCredentials } from '../../types';
import { supabase } from './supabase';

export const handleFileUpload = (
  event: React.ChangeEvent<HTMLInputElement>,
  setAgentImage: Dispatch<SetStateAction<File | null>>
) => {
  const file = event.target.files?.[0];
  if (file) {
    if (file.size > 1024 * 1024) { // 1MB check
      alert('File size must be less than 1MB');
      return;
    }
    setAgentImage(file);
  }
};

export const handleUploadClick = (fileInputRef: RefObject<HTMLInputElement>) => {
  fileInputRef.current?.click();
};

export const handleSourceClick = (
  source: string,
  setSelectedSources: Dispatch<SetStateAction<string[]>>
) => {
  setSelectedSources(prev => 
    prev.includes(source) 
      ? prev.filter(s => s !== source)
      : [...prev, source]
  );
};

export const handleActivitySelect = (
  activity: string,
  setSelectedActivities: Dispatch<SetStateAction<string[]>>
) => {
  setSelectedActivities(prev => 
    prev.includes(activity) 
      ? prev.filter(a => a !== activity)
      : [...prev, activity]
  );
};

export const handleAddUsername = (
  currentUsername: string,
  replyToUsernames: string[],
  setReplyToUsernames: Dispatch<SetStateAction<string[]>>,
  setCurrentUsername: Dispatch<SetStateAction<string>>
) => {
  const username = currentUsername.trim().replace(/^@+/, '');
  if (username && !replyToUsernames.includes(username)) {
    setReplyToUsernames([...replyToUsernames, username]);
    setCurrentUsername('');
  }
};

export const handleRemoveUsername = (
  usernameToRemove: string,
  setReplyToUsernames: Dispatch<SetStateAction<string[]>>
) => {
  setReplyToUsernames(prev => prev.filter(username => username !== usernameToRemove));
};

export const handleAddQA = (
  currentQuestion: string,
  currentAnswer: string,
  qaList: QA[],
  setQaList: Dispatch<SetStateAction<QA[]>>,
  setCurrentQuestion: Dispatch<SetStateAction<string>>,
  setCurrentAnswer: Dispatch<SetStateAction<string>>,
  setExampleQueries: Dispatch<SetStateAction<string>>
) => {
  if (currentQuestion.trim() && currentAnswer.trim()) {
    const newQA = {
      question: currentQuestion.trim(),
      answer: currentAnswer.trim()
    };
    const updatedQaList = [...qaList, newQA];
    setQaList(updatedQaList);
    setCurrentQuestion('');
    setCurrentAnswer('');
    setExampleQueries(
      updatedQaList.map(qa => `Q: ${qa.question}\nA: ${qa.answer}`).join('\n\n')
    );
  }
};

export const handleAddPost = (
  currentPost: string,
  postList: string[],
  setPostList: Dispatch<SetStateAction<string[]>>,
  setCurrentPost: Dispatch<SetStateAction<string>>,
  setExamplePosts: Dispatch<SetStateAction<string>>
) => {
  if (currentPost.trim()) {
    const newPost = currentPost.trim();
    const updatedPostList = [...postList, newPost];
    setPostList(updatedPostList);
    setCurrentPost('');
    setExamplePosts(updatedPostList.join('\n\n'));
  }
};

export const handleRemoveQA = (
  index: number,
  qaList: QA[],
  setQaList: Dispatch<SetStateAction<QA[]>>,
  setExampleQueries: Dispatch<SetStateAction<string>>
) => {
  const newList = qaList.filter((_, i) => i !== index);
  setQaList(newList);
  setExampleQueries(
    newList.map(qa => `Q: ${qa.question}\nA: ${qa.answer}`).join('\n\n')
  );
};

export const handleRemovePost = (
  index: number,
  postList: string[],
  setPostList: Dispatch<SetStateAction<string[]>>,
  setExamplePosts: Dispatch<SetStateAction<string>>
) => {
  const newList = postList.filter((_, i) => i !== index);
  setPostList(newList);
  setExamplePosts(newList.join('\n\n'));
};

export const handleImprovePrompt = async (
  prompt: string,
  setIsImprovingPrompt: Dispatch<SetStateAction<boolean>>,
  setPrompt: Dispatch<SetStateAction<string>>
) => {
  if (!prompt.trim()) return;
  
  setIsImprovingPrompt(true);
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at improving AI agent prompts. Make the prompt more specific, detailed, and effective while maintaining its original intent.'
          },
          {
            role: 'user',
            content: `Please improve this prompt: ${prompt}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      throw new Error('Failed to improve prompt');
    }

    const data = await response.json();
    const improvedPrompt = data.choices[0].message.content;
    setPrompt(improvedPrompt);
  } catch (error) {
    console.error('Error improving prompt:', error);
  } finally {
    setIsImprovingPrompt(false);
  }
};

export const handleCreateAgent = async (
  agentName: string,
  agentDescription: string,
  agentImage: File | null,
  prompt: string,
  selectedSources: string[],
  selectedActivities: string[],
  qaList: QA[],
  postList: string[],
  postingClients: string[],
  postingInterval: string,
  postingTopics: string,
  chatClients: string[],
  replyToUsernames: string[],
  replyToReplies: boolean,
  setupX: boolean,
  twitterUsername: string,
  twitterPassword: string,
  twitterEmail: string,
  twitter2FASecret: string,
  selectedModel: string,
  setIsCreating: Dispatch<SetStateAction<boolean>>,
  handleNext: () => void
) => {
  setIsCreating(true);
  try {
    // Validate posting interval
    if (postingInterval && parseInt(postingInterval) < 2) {
      alert('Posting interval must be at least 2 minutes');
      setIsCreating(false);
      return;
    }

    // Check if bucket exists, if not create it
    const { error: bucketError } = await supabase
      .storage
      .createBucket('images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
        fileSizeLimit: 1024 * 1024 * 2 // 2MB
      });

    // Upload image to storage if exists
    let imageUrl = null;
    if (agentImage) {
      const fileExt = agentImage.name.split('.').pop();
      const filePath = `agent-images/${Date.now()}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('images')
        .upload(filePath, agentImage, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (uploadError) throw uploadError;
      
      // Get the public URL for the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);
      
      imageUrl = publicUrl;
    }

    // Get current user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;

    // Prepare post and chat configurations
    const postConfiguration = {
      clients: postingClients,
      interval: parseInt(postingInterval),
      topics: postingTopics,
      enabled: postingClients.length > 0
    };

    const chatConfiguration = {
      clients: chatClients,
      reply_to_usernames: replyToUsernames,
      reply_to_replies: replyToReplies,
      enabled: chatClients.length > 0
    };

    // Prepare Twitter credentials if they exist
    let twitter_credentials: TwitterCredentials | null = null;
    if (postingClients.includes('x') || chatClients.includes('x')) {
      if (setupX && twitterUsername && twitterPassword && twitterEmail) {
        twitter_credentials = {
          'TWITTER_USERNAME=': twitterUsername.trim(),
          'TWITTER_PASSWORD=': twitterPassword,
          'TWITTER_EMAIL=': twitterEmail.trim(),
          'TWITTER_2FA_SECRET=': twitter2FASecret.trim()
        };
      } else {
        // If X is selected as a client but credentials are not set up
        alert('Please set up X credentials or remove X from the clients');
        setIsCreating(false);
        return;
      }
    }

    // Insert agent data into agents2 table with model
    const { data: agentData, error } = await supabase
      .from('agents2')
      .insert([
        {
          name: agentName,
          description: agentDescription,
          prompt: prompt,
          image: imageUrl,
          user_id: session?.user?.id,
          data_sources: selectedSources,
          activities: selectedActivities,
          sample_questions: qaList.map(qa => ({
            question: qa.question,
            answer: qa.answer
          })),
          sample_posts: postList,
          post_configuration: postConfiguration,
          chat_configuration: chatConfiguration,
          twitter_credentials: twitter_credentials ? JSON.stringify(twitter_credentials) : null,
          model: selectedModel
        }
      ])
      .select();

    if (error) throw error;

    // Only log success if we actually have agent data
    if (agentData && agentData.length > 0) {
      console.log('Agent created successfully:', agentData[0].id);
      
      // Set up posting schedule if posting is enabled
      if (postConfiguration.enabled) {
        const agentId = agentData[0].id;
        
        console.log('Posting configuration is enabled. Setting up posting schedule for agent ID:', agentId);
        console.log('Posting clients:', postingClients);
        console.log('Posting interval:', postingInterval);
        console.log('Posting topics:', postingTopics);
        
        // Format the topics and prompt to be more API-friendly
        const sanitizedTopics = postingTopics.trim().replace(/\s+/g, ' ');
        const sanitizedPrompt = prompt.trim().replace(/\s+/g, ' ');
        
        const postingPayload = {
          userId: agentId,
          interval: parseInt(postingInterval),
          query: sanitizedTopics ? `speak about ${sanitizedTopics} while you have access to access to these data sources: ${selectedSources.join(', ')}` : 'speak about general topics',
          systemPrompt: `You are an AI agent who tweets. ${sanitizedPrompt} Keep all tweets under 260 characters. Here are some example posts to guide your style and tone:\n${postList.map(post => `- "${post}"`).join('\n')}`
        };
        
        console.log('Sending posting schedule request with payload:', postingPayload);
        
        const response = await fetch(
          'https://97m15gg62a.execute-api.ap-south-1.amazonaws.com/prod/create',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(postingPayload),
            signal: AbortSignal.timeout(1000000)
          }
        );
        
        console.log('Received response from posting schedule API:', response);
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (response.ok) {
          const responseText = await response.text();
          console.log('Posting schedule API response text:', responseText);
          
          // Try to parse the response as JSON if it's not empty
          let responseData;
          if (responseText.trim()) {
            try {
              responseData = JSON.parse(responseText);
              console.log('Posting schedule API call successful with parsed response:', responseData);
            } catch (parseError) {
              console.log('Could not parse response as JSON:', parseError);
              console.log('Raw response text was:', responseText);
            }
          } else {
            console.log('Posting schedule API returned empty response with status:', response.status);
          }
        } else {
          console.log('Posting schedule API call failed with status:', response.status);
          const errorText = await response.text();
          console.log('Error response text:', errorText);
          
          // Try to parse error response as JSON if possible
          try {
            const errorJson = JSON.parse(errorText);
            console.log('Parsed error response:', errorJson);
          } catch (e) {
            // If it's not JSON, the raw text is already logged
          }
        }
      } else {
        console.log('Posting configuration is disabled. Skipping posting schedule setup.');
        console.log('Posting clients:', postingClients);
      }
      
      // Move to the success step
      handleNext();
    } else {
      // If we don't have agent data but also no error, something unexpected happened
      throw new Error('Agent creation failed: No agent data returned');
    }
  } catch (error: any) {
    console.error('Error creating agent:', error);
    alert(`Failed to create agent: ${error.message || 'Unknown error'}`);
  } finally {
    setIsCreating(false);
  }
};

export const handleSuccessAndClose = (
  onClose: () => void,
  agentName: string,
  navigate: NavigateFunction
) => {
  if (onClose) {
    onClose();
  }
  navigate(`/chat/${agentName}`);
};

export const handleNext = (
  currentStep: number,
  setupX: boolean,
  setCurrentStep: Dispatch<SetStateAction<number>>,
  slidesLength: number
) => {
  if (currentStep < slidesLength - 1) {
    if (currentStep === 9 && !setupX) {
      setCurrentStep(10);
    } else {
      setCurrentStep(currentStep + 1);
    }
  }
};

export const handleBack = (
  currentStep: number,
  setCurrentStep: Dispatch<SetStateAction<number>>
) => {
  if (currentStep > 0) {
    setCurrentStep(currentStep - 1);
  }
}; 