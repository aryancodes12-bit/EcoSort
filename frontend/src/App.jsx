import React, { useState, useRef, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhyEcoSort from './components/WhyEcoSort';
import DemoPresets from './components/DemoPresets';
import ImageUploader from './components/ImageUploader';
import AnalysisResult from './components/AnalysisResult';
import AnalysisLoader from './components/AnalysisLoader';
import SdgSection from './components/SdgSection';
import ResponsibleAiModal from './components/ResponsibleAiModal';
import Footer from './components/Footer';
import { analyzeWasteImage } from './services/apiService';
import { AlertCircle } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeDemoId, setActiveDemoId] = useState(null);
  const [activeDemoName, setActiveDemoName] = useState(null);

  // Replace flat isLoading bool with granular stage tracking
  const [loadingStage, setLoadingStage] = useState(null); // null = idle
  const [loadingFailed, setLoadingFailed] = useState(false);

  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isResponsibleAiOpen, setIsResponsibleAiOpen] = useState(false);

  const shouldReduceMotion = useReducedMotion();
  const uploadSectionRef = useRef(null);
  const resultSectionRef = useRef(null);

  const isLoading = loadingStage !== null;

  const scrollToUpload = () => {
    uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectPreset = async (demoCase) => {
    setErrorMessage(null);
    setActiveDemoId(demoCase.id);
    setActiveDemoName(demoCase.name);
    setSelectedImage({
      file: null,
      base64Data: demoCase.image,
      previewUrl: demoCase.image,
      source: 'preset',
    });

    triggerAnalysis({
      file: null,
      base64Data: demoCase.image,
      demoId: demoCase.id,
    });
  };

  const handleImageSelected = (imageData) => {
    setErrorMessage(null);
    setActiveDemoId(null);
    setActiveDemoName(null);
    setSelectedImage(imageData);
    setResult(null);
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setActiveDemoId(null);
    setActiveDemoName(null);
    setResult(null);
    setErrorMessage(null);
    setLoadingStage(null);
    setLoadingFailed(false);
  };

  const triggerAnalysis = async (customPayload) => {
    const payload = customPayload || {
      file: selectedImage?.file,
      base64Data: selectedImage?.base64Data,
      activeDemoId: activeDemoId,
    };

    // Reset state for new run
    setResult(null);
    setErrorMessage(null);
    setLoadingFailed(false);
    setLoadingStage('uploading'); // stage 1 — before fetch is even sent

    // Scroll to loader immediately
    setTimeout(() => {
      resultSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 80);

    try {
      const response = await analyzeWasteImage({
        file: payload.file ?? null,
        base64Data: payload.base64Data ?? null,
        activeDemoId: payload.demoId ?? payload.activeDemoId ?? null,
        onStageChange: (stage) => setLoadingStage(stage),
      });

      // Small pause on 'preparing' so the user sees the final stage
      await new Promise(r => setTimeout(r, 280));

      setLoadingStage(null);
      setResult(response);
    } catch (err) {
      console.error('Analysis error:', err);
      setLoadingFailed(true);
      // Keep the stage indicator visible for a moment showing failure
      await new Promise(r => setTimeout(r, 900));
      setLoadingStage(null);
      setLoadingFailed(false);
      setErrorMessage('We could not analyze this image right now. Please check your image or try one of the demo presets.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar onOpenResponsibleAi={() => setIsResponsibleAiOpen(true)} />

      <main style={{ flex: 1 }}>
        <Hero onScrollToUpload={scrollToUpload} />

        {/* Why EcoSort AI + How It Works 3-Step Strip */}
        <WhyEcoSort />

        <div className="container" ref={uploadSectionRef} style={{ maxWidth: '900px' }}>
          {/* Error Banner — glass-sm surface */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="glass-sm"
                style={{
                  padding: '0.9rem 1.1rem',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.7rem',
                  color: '#991b1b',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(254,242,242,0.75)',
                  border: '1px solid rgba(252,165,165,0.5)',
                }}
              >
                <AlertCircle size={19} color="#dc2626" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '0.875rem' }}>{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Benchmark Presets */}
          <DemoPresets
            onSelectPreset={handleSelectPreset}
            activeDemoId={activeDemoId}
          />

          {/* Upload and Webcam Interface */}
          <ImageUploader
            imagePreview={selectedImage?.previewUrl}
            onImageSelected={handleImageSelected}
            onClearImage={handleClearImage}
            onAnalyze={() => triggerAnalysis()}
            isLoading={isLoading}
            activeDemoName={activeDemoName}
          />

          {/* Result / Loader area */}
          <div ref={resultSectionRef}>
            <AnimatePresence mode="wait">
              {/* Loading skeleton */}
              {isLoading && (
                <AnalysisLoader
                  key="loader"
                  currentStage={loadingStage}
                  failed={loadingFailed}
                />
              )}

              {/* Analysis result */}
              {!isLoading && result && (
                <motion.div
                  key={result.item || 'result-card'}
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 24 }}
                >
                  <AnalysisResult
                    result={result}
                    onReset={handleClearImage}
                    onRunLive={() => triggerAnalysis({
                      file: selectedImage?.file,
                      base64Data: selectedImage?.base64Data,
                      activeDemoId: null,
                    })}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* SDG Alignment & Design Thinking Breakdown */}
        <SdgSection />
      </main>

      <Footer onOpenResponsibleAi={() => setIsResponsibleAiOpen(true)} />

      {/* Responsible AI Modal */}
      <ResponsibleAiModal
        isOpen={isResponsibleAiOpen}
        onClose={() => setIsResponsibleAiOpen(false)}
      />
    </div>
  );
}
