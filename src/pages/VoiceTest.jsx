import { useEffect, useState } from 'react';
import voiceService from '../utils/voiceService';
import VoiceControl from '../components/VoiceControl';

export default function VoiceTest() {
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');

  useEffect(() => {
    // Get available voices after they load
    setTimeout(() => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
      const currentVoice = voiceService.selectedVoice;
      setSelectedVoice(currentVoice?.name || 'Loading...');
    }, 500);
  }, []);

  const testText = "Hello student! Welcome to IGBOYA Math Learning Platform. I will be your teacher today. Let's learn mathematics together in a fun and interactive way!";

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
      padding: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        maxWidth: '600px',
        background: 'white',
        borderRadius: '24px',
        padding: '32px',
        border: '1px solid #E2E8F0',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎙️</div>
        <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Voice Test</h1>
        <p style={{ color: '#64748B', marginBottom: '24px' }}>
          Selected Voice: <strong style={{ color: '#6366F1' }}>{selectedVoice}</strong>
        </p>
        
        <div style={{ marginBottom: '24px' }}>
          <VoiceControl text={testText} buttonText="🔊 Test Teacher Voice" />
        </div>
        
        <div style={{
          background: '#F8FAFC',
          borderRadius: '16px',
          padding: '16px',
          textAlign: 'left',
          marginTop: '24px'
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Available Voices:</h3>
          <div style={{ fontSize: '12px', color: '#64748B', maxHeight: '200px', overflow: 'auto' }}>
            {availableVoices.map((voice, i) => (
              <div key={i} style={{ padding: '4px 0' }}>
                {voice.name} ({voice.lang})
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
