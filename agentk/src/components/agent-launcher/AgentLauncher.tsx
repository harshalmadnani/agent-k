import React, { useRef, useState as useReactState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './AgentLauncher.css';
import { useNavigate } from 'react-router-dom';
import { AgentLauncherProps, QA } from '../../types';
import { characterOptions, dataSources, slides } from './constants';
import { useAgentState, loadingAnimation } from './hooks';
import { 
  handleFileUpload,
  handleUploadClick,
  handleSourceClick,
  handleActivitySelect,
  handleAddUsername,
  handleRemoveUsername,
  handleAddQA,
  handleAddPost,
  handleRemoveQA,
  handleRemovePost,
  handleImprovePrompt,
  handleCreateAgent,
  handleSuccessAndClose,
  handleNext as handleNextStep,
  handleBack as handleBackStep
} from './event-handlers';

const AgentLauncher: React.FC<AgentLauncherProps> = ({ onClose }) => {
  const {
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
  } = useAgentState();

  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [slideImageLoaded, setSlideImageLoaded] = useReactState(false);
  const [activityImages, setActivityImages] = useReactState({
    post: false,
    chat: false
  });

  // Reset image loaded state when slide changes
  useEffect(() => {
    setSlideImageLoaded(false);
    setActivityImages({
      post: false,
      chat: false
    });
  }, [currentStep]);

  // Update slide titles to include agent name
  const currentSlide = { 
    ...slides[currentStep], 
    title: slides[currentStep].title.replace('your agent', agentName || 'your agent')
  };

  const filteredSources = dataSources.filter(source =>
    source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNext = () => {
    handleNextStep(currentStep, setupX, setCurrentStep, slides.length);
  };

  const handleBack = () => {
    handleBackStep(currentStep, setCurrentStep);
  };

  return (
    <div className="agent-launcher-container">
      <div className="progress-bar-container">
        <div 
          className="progress-bar"
          style={{
            width: `${((currentStep + 1) / slides.length) * 100}%`,
            height: '4px',
            backgroundColor: '#FFFFFF',
            borderRadius: '2px',
            transition: 'width 0.3s ease-in-out'
          }}
        />
        <div style={{ 
          color: 'white', 
          fontSize: '14px', 
          marginTop: '8px',
          textAlign: 'right'
        }}>
          {`Step ${currentStep + 1} of ${slides.length}`}
        </div>
      </div>

      {currentStep > 0 && (
        <IconButton 
          className="back-button"
          onClick={handleBack}
          sx={{ 
            color: 'white',
            position: 'absolute',
            top: '20px',
            left: '40px',
            zIndex: 1,
            '@media (max-width: 768px)': {
              display: 'none'
            }
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      )}
      
      {/* Add close button */}
      <IconButton 
        onClick={() => {
          onClose();
          // Find the imported onToggleView function from the parent
          if (typeof window !== 'undefined') {
            const event = new CustomEvent('navigateToChat', {});
            window.dispatchEvent(event);
          }
        }}
        sx={{ 
          color: 'white',
          position: 'absolute',
          top: '20px',
          right: '40px',
          zIndex: 1,
          '@media (max-width: 768px)': {
            display: 'none'
          }
        }}
      >
        ×
      </IconButton>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="slide-container"
          ref={containerRef}
        >
          <div className="slide-content">
            <div className="image-container">
              <div 
                style={{ 
                  width: '90%',
                  height: '50%',
                  borderRadius: '12px',
                  backgroundColor: '#2a2a2a',
                  display: slideImageLoaded ? 'none' : 'block'
                }}
              />
              <img 
                src={currentSlide.image} 
                alt={`Step ${currentStep + 1}`}
                className="slide-image"
                style={{ 
                  width: '90%',
                  height: '50%',
                  objectFit: "contain",
                  borderRadius: '12px',
                  display: slideImageLoaded ? 'block' : 'none'
                }}
                loading="eager"
                onLoad={() => setSlideImageLoaded(true)}
                onError={() => setSlideImageLoaded(true)} // Show image anyway if error
              />
            </div>
            
            <div className="content-container">
              <h2 style={{ marginBottom: '1.5rem' }}>{currentSlide.title}</h2>
              
              {/* Form for agent name and description */}
              {currentSlide.hasForm && (
                <>
                  <p>{currentSlide.content}</p>
                  <input
                    type="text"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="Enter agent name"
                    style={{
                      width: '90%',
                      padding: '10px 12px',
                      marginBottom: '16px',
                      backgroundColor: '#1a1a1a',
                      border: 'none',
                      borderRadius: '10px',
                      color: 'white',
                      height: '40px',
                      fontSize: '14px'
                    }}
                  />
                  <p>{`What should people know about ${agentName || 'your agent'}?`}</p>
                  <textarea
                    value={agentDescription}
                    onChange={(e) => setAgentDescription(e.target.value)}
                    placeholder="Add some description about the agent that everyone will see"
                    style={{
                      width: '90%',
                      padding: '12px',
                      marginBottom: '20px',
                      backgroundColor: '#1a1a1a',
                      border: 'none',
                      borderRadius: '10px',
                      color: 'white',
                      minHeight: '50%',
                      resize: 'vertical'
                    }}
                  />
                </>
              )}
              
              {/* Image upload section */}
              {currentSlide.hasUpload && (
                <>
                  <p>{currentSlide.content}</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => handleFileUpload(e, setAgentImage)}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  <div style={{ display: 'flex', gap: '10px', marginTop: '20px', marginBottom: '20px' }}>
                    <button 
                      className="next-button"
                      onClick={() => {
                        if (fileInputRef.current) {
                          fileInputRef.current.click();
                        }
                      }}
                      style={{ flex: 1 }}
                    >
                      Upload
                    </button>
                    <button 
                      className="next-button"
                      onClick={handleNext}
                      style={{ 
                        flex: 1,
                        backgroundColor: 'transparent',
                        border: '1px solid white',
                        color:'#FFF'
                      }}
                    >
                      Maybe later
                    </button>
                  </div>
                  {agentImage && (
                    <>
                      <p style={{ marginTop: '10px', color: 'green' }}>
                        Image uploaded: {agentImage.name}
                      </p>
                      <button 
                        className="next-button"
                        onClick={handleNext}
                        style={{ marginTop: '20px' }}
                      >
                        Continue
                      </button>
                    </>
                  )}
                </>
              )}
              
              {/* Activities selection */}
              {currentSlide.hasActivities && (
                <div style={{ width: '90%' }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '16px',
                    marginBottom: '20px'
                  }}>
                    <div
                      onClick={() => handleActivitySelect('post', setSelectedActivities)}
                      style={{
                        backgroundColor: '#1a1a1a',
                        borderRadius: '12px',
                        padding: '16px',
                        cursor: 'pointer',
                        border: selectedActivities.includes('post') ? '1px solid white' : '1px solid transparent'
                      }}
                    >
                      <div 
                        style={{
                          width: '100%',
                          height: '150px', // Adjust based on your expected image height
                          backgroundColor: '#2a2a2a',
                          borderRadius: '8px',
                          marginBottom: '8px',
                          display: activityImages.post ? 'none' : 'block'
                        }}
                      />
                      <img 
                        src="https://wbsnlpviggcnwqfyfobh.supabase.co/storage/v1/object/public/app//picture8.png" 
                        alt="Post sentiently"
                        style={{
                          width: '100%',
                          height: 'auto',
                          marginBottom: '8px',
                          borderRadius: '8px',
                          display: activityImages.post ? 'block' : 'none'
                        }}
                        onLoad={() => setActivityImages(prev => ({ ...prev, post: true }))}
                        onError={() => setActivityImages(prev => ({ ...prev, post: true }))}
                      />
                      <p style={{ margin: 0, textAlign: 'center' }}>Post sentiently</p>
                    </div>
                    
                    <div
                      onClick={() => handleActivitySelect('chat', setSelectedActivities)}
                      style={{
                        backgroundColor: '#1a1a1a',
                        borderRadius: '12px',
                        padding: '16px',
                        cursor: 'pointer',
                        border: selectedActivities.includes('chat') ? '1px solid white' : '1px solid transparent'
                      }}
                    >
                      <div 
                        style={{
                          width: '100%',
                          height: '150px', // Adjust based on your expected image height
                          backgroundColor: '#2a2a2a',
                          borderRadius: '8px',
                          marginBottom: '8px',
                          display: activityImages.chat ? 'none' : 'block'
                        }}
                      />
                      <img 
                        src="https://wbsnlpviggcnwqfyfobh.supabase.co/storage/v1/object/public/app//picture9.png" 
                        alt="Chat and Interact"
                        style={{
                          width: '100%',
                          height: 'auto',
                          marginBottom: '8px',
                          borderRadius: '8px',
                          display: activityImages.chat ? 'block' : 'none'
                        }}
                        onLoad={() => setActivityImages(prev => ({ ...prev, chat: true }))}
                        onError={() => setActivityImages(prev => ({ ...prev, chat: true }))}
                      />
                      <p style={{ margin: 0, textAlign: 'center' }}>Chat and Interact</p>
                    </div>
                  </div>
                  
                  <button 
                    className="next-button"
                    onClick={handleNext}
                    style={{
                      width: '100%',
                      backgroundColor: 'white',
                      color: 'black',
                      padding: '12px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: '500',
                      marginTop: '20px'
                    }}
                  >
                    Continue
                  </button>
                </div>
              )}
              
              {/* Default content */}
              {!currentSlide.hasForm && !currentSlide.hasUpload && !currentSlide.hasActivities && !currentSlide.hasDataSources && !currentSlide.hasPrompt && !currentSlide.hasModelSelection && !currentSlide.hasPostingConfig && !currentSlide.hasChatConfig && !currentSlide.hasXConfig && !currentSlide.hasExamples && !currentSlide.hasReview && !currentSlide.hasSuccess && (
                <p style={{ marginBottom: '1.5rem' }}>{currentSlide.content}</p>
              )}
              
              {/* First step button */}
              {currentStep === 0 ? (
                <button 
                  className="next-button"
                  onClick={handleNext}
                  style={{ marginTop: '1rem' }}
                >
                  Let's get started
                </button>
              ) : (
                <button 
                  className="next-button"
                  onClick={handleNext}
                  disabled={currentStep === slides.length - 1}
                  style={{ 
                    marginTop: '1rem',
                    display: (currentStep === slides.length - 1 || 
                            currentStep === 5 || 
                            currentStep === 2 ||
                            currentStep === 6 ||
                            currentStep === 7 ||
                            currentStep === 8 ||
                            currentStep === 9 ||
                            currentStep === 4 ||
                            currentStep === 3 ||
                            currentSlide.hasReview ||
                            currentSlide.hasXDetails) ? 'none' : 'block'
                  }}
                >
                  Continue
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AgentLauncher; 