import React, { useState, useRef } from 'react';
import { UploadCloud, Camera, X, Sparkles, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { springSnappy, buttonTap } from '../motion-presets';

export default function ImageUploader({
  imagePreview,
  onImageSelected,
  onClearImage,
  onAnalyze,
  isLoading,
  activeDemoName
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  };
  const handleFileChange = (e) => {
    if (e.target.files?.[0]) processFile(e.target.files[0]);
  };

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPEG, PNG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      onImageSelected({
        file,
        base64Data: event.target.result,
        previewUrl: event.target.result,
        source: 'upload',
      });
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      alert('Camera access could not be established. Please upload an image instead.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg');
    stopCamera();
    onImageSelected({ file: null, base64Data: dataUrl, previewUrl: dataUrl, source: 'camera' });
  };

  return (
    <motion.div
      className="glass-md"
      style={{ padding: '2rem', marginBottom: '2.5rem' }}
      layout
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      <AnimatePresence mode="wait">
        {/* ── Live Camera View ── */}
        {isCameraActive && (
          <motion.div
            key="camera"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={springSnappy}
            style={{ textAlign: 'center' }}
          >
            <div style={{
              position: 'relative',
              maxWidth: '500px',
              margin: '0 auto 1.25rem',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              background: '#000',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            }}>
              <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.85rem' }}>
              <motion.button onClick={capturePhoto} className="btn-primary" {...buttonTap}>
                <Camera size={17} /> Capture Snapshot
              </motion.button>
              <motion.button onClick={stopCamera} className="btn-secondary" {...buttonTap}>
                Cancel
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ── Preview ── */}
        {!isCameraActive && imagePreview && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={springSnappy}
            style={{ textAlign: 'center' }}
          >
            <div style={{
              position: 'relative',
              display: 'inline-block',
              maxWidth: '480px',
              width: '100%',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              background: '#000',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            }}>
              {isLoading && <div className="scanning-radar" />}

              <img
                src={imagePreview}
                alt="Waste to segregate"
                style={{ width: '100%', maxHeight: '360px', objectFit: 'contain', display: 'block', background: '#f8fafc' }}
              />

              {!isLoading && (
                <motion.button
                  onClick={onClearImage}
                  title="Remove Image"
                  className="btn-icon"
                  style={{ position: 'absolute', top: '10px', right: '10px', backdropFilter: 'blur(8px)' }}
                  whileTap={{ scale: 0.88, transition: springSnappy }}
                >
                  <X size={16} />
                </motion.button>
              )}

              {activeDemoName && (
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '10px',
                  background: 'rgba(13, 40, 24, 0.78)',
                  color: '#fff',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  padding: '0.2rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                  backdropFilter: 'blur(6px)',
                }}>
                  Preset: {activeDemoName}
                </div>
              )}
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
              <motion.button
                onClick={onAnalyze}
                disabled={isLoading}
                className="btn-primary"
                style={{ minWidth: '200px' }}
                whileTap={!isLoading ? { scale: 0.96, transition: springSnappy } : {}}
              >
                {isLoading ? (
                  <><RefreshCw size={17} className="animate-spin" /> Analyzing Waste...</>
                ) : (
                  <><Sparkles size={17} /> Analyze Waste</>
                )}
              </motion.button>

              {!isLoading && (
                <motion.button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-secondary"
                  {...buttonTap}
                >
                  Replace Image
                </motion.button>
              )}
            </div>
          </motion.div>
        )}

        {/* ── Dropzone ── */}
        {!isCameraActive && !imagePreview && (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: isDragging
                ? '2px dashed var(--color-emerald)'
                : '2px dashed rgba(226, 232, 240, 0.8)',
              background: isDragging
                ? 'rgba(16, 185, 129, 0.08)'
                : 'rgba(248, 250, 252, 0.45)',
              borderRadius: 'var(--radius-lg)',
              padding: '3rem 1.5rem',
              textAlign: 'center',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
            }}
          >
            <motion.div
              animate={isDragging ? { scale: 1.15 } : { scale: 1 }}
              transition={springSnappy}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.12)',
                color: 'var(--color-emerald)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                boxShadow: isDragging ? 'var(--shadow-glow)' : 'none',
              }}
            >
              <UploadCloud size={30} />
            </motion.div>

            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--color-forest)' }}>
              Upload Waste Image
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
              Drag and drop your photo here, or select from your device. Supported formats: JPEG, PNG, WEBP.
            </p>

            <div
              style={{ display: 'flex', justifyContent: 'center', gap: '0.85rem', flexWrap: 'wrap' }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn-primary"
                style={{ fontSize: '0.9rem', padding: '0.7rem 1.4rem' }}
                whileTap={{ scale: 0.96, transition: springSnappy }}
              >
                <UploadCloud size={16} /> Choose File
              </motion.button>

              <motion.button
                type="button"
                onClick={startCamera}
                className="btn-secondary"
                style={{ fontSize: '0.9rem', padding: '0.7rem 1.4rem' }}
                {...buttonTap}
              >
                <Camera size={16} /> Use Camera
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
