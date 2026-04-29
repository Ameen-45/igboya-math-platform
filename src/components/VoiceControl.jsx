import { useState, useEffect } from 'react';
import voiceService from '../utils/voiceService';

export default function VoiceControl({ text, onStart, onEnd, buttonText }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    setIsSupported(voiceService.isSupported());
    return () => {
      if (isPlaying) {
        voiceService.stop();
      }
    };
  }, []);

  const handleSpeak = async () => {
    if (isPlaying) {
      voiceService.stop();
      setIsPlaying(false);
      onEnd?.();
    } else {
      try {
        await voiceService.speak(text, {
          onStart: () => {
            setIsPlaying(true);
            onStart?.();
          },
          onEnd: () => {
            setIsPlaying(false);
            onEnd?.();
          },
          rate: 0.85,
          pitch: 1.05
        });
      } catch (error) {
        console.error('Speech failed:', error);
        setIsPlaying(false);
      }
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <button
      onClick={handleSpeak}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 20px',
        background: isPlaying ? '#EF4444' : '#6366F1',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 8px rgba(99, 102, 241, 0.2)'
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <span style={{ fontSize: '16px' }}>{isPlaying ? '🔊' : '🔈'}</span>
      <span>{buttonText || (isPlaying ? 'Playing...' : 'Listen to Explanation')}</span>
    </button>
  );
}
