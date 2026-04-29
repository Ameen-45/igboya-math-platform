import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

export default function DataAnalyzer() {
  const [dataset, setDataset] = useState('');
  const [numbers, setNumbers] = useState([]);
  const [results, setResults] = useState(null);
  const [steps, setSteps] = useState([]);
  const [activeTab, setActiveTab] = useState('input');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const speechSynth = useRef(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const stopSpeech = useCallback(() => {
    if (speechSynth.current) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  }, []);

  const speakText = useCallback((text) => {
    stopSpeech();
    if (!("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.pitch = 1.05;
    utterance.volume = 1;
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    speechSynth.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [stopSpeech]);

  const sampleDatasets = {
    'Test Scores': '85, 92, 78, 96, 88, 76, 95, 89, 91, 84',
    'Heights (cm)': '165, 172, 168, 185, 170, 175, 162, 178, 182, 169',
    'Sales Data': '1200, 1500, 900, 1800, 2100, 1300, 1700, 1400, 1600, 1900',
    'Temperatures': '22.5, 24.8, 21.3, 26.1, 23.7, 25.2, 20.9, 24.5, 23.1, 25.8'
  };

  const parseDataset = (input) => {
    return input
      .split(',')
      .map(num => parseFloat(num.trim()))
      .filter(num => !isNaN(num));
  };

  const calculateStatistics = () => {
    if (!dataset.trim()) {
      speakText('Please enter a dataset');
      alert('Please enter a dataset');
      return;
    }

    const data = parseDataset(dataset);
    if (data.length === 0) {
      speakText('Please enter valid numbers');
      alert('Please enter valid numbers');
      return;
    }

    setNumbers(data);
    const newSteps = [];
    const newResults = {};

    // Step 1: Sort the data
    const sortedData = [...data].sort((a, b) => a - b);
    newSteps.push({
      title: 'Step 1: Sort the data',
      description: `Original: [${data.join(', ')}] → Sorted: [${sortedData.join(', ')}]`,
      formula: 'Sort numbers in ascending order',
      voiceText: `Step 1. Sort the data. Original values: ${data.join(', ')}. Sorted: ${sortedData.join(', ')}.`
    });

    // Step 2: Calculate Mean
    const sum = data.reduce((a, b) => a + b, 0);
    const mean = sum / data.length;
    newSteps.push({
      title: 'Step 2: Calculate Mean (Average)',
      description: `Sum all values and divide by count: ${data.join(' + ')} = ${sum} ÷ ${data.length} = ${mean.toFixed(2)}`,
      formula: 'Mean = (Σx) / n',
      voiceText: `Step 2. Calculate mean. Sum of all values is ${sum}. Divide by ${data.length}. Mean is ${mean.toFixed(2)}.`
    });
    newResults.mean = mean;

    // Step 3: Calculate Median
    let median;
    const mid = Math.floor(sortedData.length / 2);
    if (sortedData.length % 2 === 0) {
      median = (sortedData[mid - 1] + sortedData[mid]) / 2;
      newSteps.push({
        title: 'Step 3: Calculate Median',
        description: `Even number of values: (${sortedData[mid - 1]} + ${sortedData[mid]}) ÷ 2 = ${median.toFixed(2)}`,
        formula: 'Median = average of two middle values',
        voiceText: `Step 3. Calculate median. Even number of values. The middle values are ${sortedData[mid - 1]} and ${sortedData[mid]}. Their average is ${median.toFixed(2)}.`
      });
    } else {
      median = sortedData[mid];
      newSteps.push({
        title: 'Step 3: Calculate Median',
        description: `Odd number of values: Middle value = ${median}`,
        formula: 'Median = middle value',
        voiceText: `Step 3. Calculate median. Odd number of values. The middle value is ${median}.`
      });
    }
    newResults.median = median;

    // Step 4: Calculate Mode
    const frequency = {};
    data.forEach(num => {
      frequency[num] = (frequency[num] || 0) + 1;
    });
    
    let maxFreq = 0;
    let modes = [];
    Object.keys(frequency).forEach(num => {
      if (frequency[num] > maxFreq) {
        maxFreq = frequency[num];
        modes = [parseFloat(num)];
      } else if (frequency[num] === maxFreq && maxFreq > 1) {
        modes.push(parseFloat(num));
      }
    });

    const modeText = maxFreq > 1 ? 
      `Value(s) ${modes.join(', ')} appear ${maxFreq} times each` : 
      'No mode (all values are unique)';
    
    newSteps.push({
      title: 'Step 4: Calculate Mode',
      description: modeText,
      formula: 'Mode = most frequent value(s)',
      voiceText: `Step 4. Calculate mode. ${modeText}`
    });
    newResults.mode = modes;
    newResults.modeFrequency = maxFreq;

    // Step 5: Calculate Range
    const range = sortedData[sortedData.length - 1] - sortedData[0];
    newSteps.push({
      title: 'Step 5: Calculate Range',
      description: `Max - Min = ${sortedData[sortedData.length - 1]} - ${sortedData[0]} = ${range.toFixed(2)}`,
      formula: 'Range = Maximum - Minimum',
      voiceText: `Step 5. Calculate range. Maximum is ${sortedData[sortedData.length - 1]}, minimum is ${sortedData[0]}. Range is ${range.toFixed(2)}.`
    });
    newResults.range = range;

    // Step 6: Calculate Standard Deviation
    const squaredDiffs = data.map(num => Math.pow(num - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / data.length;
    const stdDev = Math.sqrt(variance);
    
    newSteps.push({
      title: 'Step 6: Calculate Standard Deviation',
      description: `Variance = ${variance.toFixed(2)}, Standard Deviation = √${variance.toFixed(2)} = ${stdDev.toFixed(2)}`,
      formula: 'σ = √[Σ(x - μ)² / n]',
      voiceText: `Step 6. Calculate standard deviation. Variance is ${variance.toFixed(2)}. Standard deviation is ${stdDev.toFixed(2)}.`
    });
    newResults.stdDev = stdDev;
    newResults.variance = variance;

    // Step 7: Calculate Quartiles
    const q1 = calculateQuartile(sortedData, 0.25);
    const q3 = calculateQuartile(sortedData, 0.75);
    const iqr = q3 - q1;
    
    newSteps.push({
      title: 'Step 7: Calculate Quartiles & IQR',
      description: `Q1 = ${q1.toFixed(2)}, Q3 = ${q3.toFixed(2)}, IQR = ${q3.toFixed(2)} - ${q1.toFixed(2)} = ${iqr.toFixed(2)}`,
      formula: 'IQR = Q3 - Q1',
      voiceText: `Step 7. Calculate quartiles. First quartile is ${q1.toFixed(2)}. Third quartile is ${q3.toFixed(2)}. Interquartile range is ${iqr.toFixed(2)}.`
    });
    newResults.quartiles = { q1, q2: median, q3, iqr };

    newResults.count = data.length;
    newResults.min = sortedData[0];
    newResults.max = sortedData[sortedData.length - 1];
    newResults.sum = sum;
    newResults.sortedData = sortedData;

    setResults(newResults);
    setSteps(newSteps);
    setActiveTab('results');
    speakText(`Analysis complete. Found ${data.length} values. Mean is ${mean.toFixed(2)}. Median is ${median.toFixed(2)}. ${modeText}`);
  };

  const calculateQuartile = (sortedData, percentile) => {
    const pos = (sortedData.length - 1) * percentile;
    const base = Math.floor(pos);
    const rest = pos - base;
    
    if (sortedData[base + 1] !== undefined) {
      return sortedData[base] + rest * (sortedData[base + 1] - sortedData[base]);
    } else {
      return sortedData[base];
    }
  };

  const loadSampleData = (datasetName) => {
    setDataset(sampleDatasets[datasetName]);
    speakText(`Loaded sample dataset: ${datasetName}`);
  };

  const clearData = () => {
    setDataset('');
    setResults(null);
    setSteps([]);
    setActiveTab('input');
    speakText('Data cleared');
  };

  const readResults = () => {
    if (results) {
      speakText(`Analysis results: ${results.count} values. Mean: ${results.mean.toFixed(2)}. Median: ${results.median.toFixed(2)}. Range: ${results.range.toFixed(2)}. Standard deviation: ${results.stdDev.toFixed(2)}.`);
    }
  };

  useEffect(() => {
    return () => stopSpeech();
  }, [stopSpeech]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #F1F5F9 100%)',
      padding: isMobile ? '16px' : '24px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Breadcrumb Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '14px', color: '#64748B', flexWrap: 'wrap' }}>
          <Link to="/dashboard" style={{ color: '#64748B', textDecoration: 'none' }}>Dashboard</Link>
          <span>›</span>
          <Link to="/topics" style={{ color: '#64748B', textDecoration: 'none' }}>Topics</Link>
          <span>›</span>
          <Link to="/topics/statistics" style={{ color: '#64748B', textDecoration: 'none' }}>Statistics</Link>
          <span>›</span>
          <span style={{ color: '#F59E0B', fontWeight: '500' }}>Data Analyzer</span>
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: isMobile ? '70px' : '80px',
            height: isMobile ? '70px' : '80px',
            background: 'linear-gradient(135deg, #F59E0B, #D97706)',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 20px 40px -12px rgba(245, 158, 11, 0.3)'
          }}>
            <span style={{ fontSize: isMobile ? '32px' : '36px' }}>🧪</span>
          </div>
          <h1 style={{
            fontSize: isMobile ? '28px' : '36px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #F59E0B, #D97706, #B45309)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '12px'
          }}>
            Data Analyzer
          </h1>
          <p style={{ fontSize: isMobile ? '14px' : '16px', color: '#64748B' }}>
            Enter your dataset and get comprehensive statistical analysis with step-by-step explanations
          </p>
        </div>

        {/* Main Content */}
        <div style={{
          background: 'white',
          borderRadius: '24px',
          border: '1px solid #E2E8F0',
          overflow: 'hidden'
        }}>
          
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0' }}>
            {[
              { id: 'input', label: '📊 Input Data', icon: '📊' },
              { id: 'results', label: '📈 Results', icon: '📈' },
              { id: 'steps', label: '🔍 Step by Step', icon: '🔍' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'results' && results) speakText('Viewing results. Click the listen button for summary.');
                  if (tab.id === 'steps' && steps.length) speakText(`Viewing step by step analysis. ${steps.length} steps available.`);
                }}
                disabled={tab.id !== 'input' && !results}
                style={{
                  flex: 1,
                  padding: '16px',
                  textAlign: 'center',
                  fontWeight: '600',
                  fontSize: '14px',
                  background: activeTab === tab.id ? '#FEF3C7' : 'white',
                  color: activeTab === tab.id ? '#D97706' : (tab.id !== 'input' && !results ? '#CBD5E1' : '#64748B'),
                  borderBottom: activeTab === tab.id ? '2px solid #F59E0B' : 'none',
                  cursor: (tab.id !== 'input' && !results) ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ padding: isMobile ? '20px' : '24px' }}>
            
            {/* Input Tab */}
            {activeTab === 'input' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#334155',
                    marginBottom: '8px'
                  }}>
                    Enter your dataset (comma-separated values):
                  </label>
                  <textarea
                    value={dataset}
                    onChange={(e) => setDataset(e.target.value)}
                    placeholder="e.g., 85, 92, 78, 96, 88, 76, 95, 89, 91, 84"
                    style={{
                      width: '100%',
                      height: '120px',
                      padding: '12px 16px',
                      border: '1px solid #E2E8F0',
                      borderRadius: '16px',
                      fontSize: '14px',
                      resize: 'vertical',
                      fontFamily: 'monospace'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#F59E0B'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#E2E8F0'}
                  />
                </div>

                {/* Sample Datasets */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#334155',
                    marginBottom: '8px'
                  }}>
                    Quick sample datasets:
                  </label>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                    gap: '8px'
                  }}>
                    {Object.keys(sampleDatasets).map((name) => (
                      <button
                        key={name}
                        onClick={() => loadSampleData(name)}
                        style={{
                          padding: '10px 16px',
                          background: '#F8FAFC',
                          border: '1px solid #E2E8F0',
                          borderRadius: '12px',
                          fontSize: '13px',
                          fontWeight: '500',
                          color: '#475569',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#FEF3C7';
                          e.currentTarget.style.borderColor = '#FDE68A';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#F8FAFC';
                          e.currentTarget.style.borderColor = '#E2E8F0';
                        }}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    onClick={calculateStatistics}
                    style={{
                      flex: 1,
                      padding: '12px 20px',
                      background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '14px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    🔬 Analyze Data
                  </button>
                  <button
                    onClick={clearData}
                    style={{
                      flex: 1,
                      padding: '12px 20px',
                      background: '#64748B',
                      color: 'white',
                      border: 'none',
                      borderRadius: '14px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    🗑️ Clear Data
                  </button>
                </div>

                {/* Instructions */}
                <div style={{
                  background: '#FEF3C7',
                  borderRadius: '16px',
                  padding: '16px',
                  border: '1px solid #FDE68A'
                }}>
                  <h3 style={{ fontWeight: '600', color: '#92400E', marginBottom: '8px', fontSize: '14px' }}>📖 How to use:</h3>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#92400E', lineHeight: '1.6' }}>
                    <li>Enter numbers separated by commas (e.g., 1, 2, 3, 4, 5)</li>
                    <li>Use the sample datasets for quick testing</li>
                    <li>Click "Analyze Data" to see statistical results</li>
                    <li>View step-by-step calculations in the "Step by Step" tab</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Results Tab */}
            {activeTab === 'results' && results && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Listen Button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={readResults}
                    style={{
                      padding: '8px 16px',
                      background: '#F59E0B',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span>🔊</span> Read Results
                  </button>
                </div>

                {/* Stats Cards */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(160px, 1fr))',
                  gap: '12px'
                }}>
                  <StatCard title="Count" value={results.count} color="#6366F1" />
                  <StatCard title="Mean" value={results.mean.toFixed(2)} color="#F59E0B" />
                  <StatCard title="Median" value={results.median.toFixed(2)} color="#10B981" />
                  <StatCard 
                    title="Mode" 
                    value={results.modeFrequency > 1 ? results.mode.join(', ') : 'No mode'} 
                    color="#8B5CF6"
                  />
                  <StatCard title="Range" value={results.range.toFixed(2)} color="#EC4899" />
                  <StatCard title="Std Dev" value={results.stdDev.toFixed(2)} color="#06B6D4" />
                  <StatCard title="Variance" value={results.variance.toFixed(2)} color="#F97316" />
                  <StatCard title="Min" value={results.min.toFixed(2)} color="#3B82F6" />
                  <StatCard title="Max" value={results.max.toFixed(2)} color="#3B82F6" />
                  <StatCard title="Sum" value={results.sum.toFixed(2)} color="#6366F1" />
                  <StatCard title="Q1" value={results.quartiles.q1.toFixed(2)} color="#14B8A6" />
                  <StatCard title="Q3" value={results.quartiles.q3.toFixed(2)} color="#14B8A6" />
                  <StatCard title="IQR" value={results.quartiles.iqr.toFixed(2)} color="#0EA5E9" />
                </div>

                {/* Data Summary */}
                <div style={{
                  background: '#F8FAFC',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '1px solid #E2E8F0'
                }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0F172A', marginBottom: '12px' }}>Data Summary</h3>
                  <p style={{ fontSize: '13px', color: '#475569', marginBottom: '8px', wordBreak: 'break-all' }}>
                    <strong>Original Data:</strong> [{numbers.slice(0, 20).join(', ')}{numbers.length > 20 ? '...' : ''}]
                  </p>
                  <p style={{ fontSize: '13px', color: '#475569', wordBreak: 'break-all' }}>
                    <strong>Sorted Data:</strong> [{results.sortedData.slice(0, 20).join(', ')}{results.sortedData.length > 20 ? '...' : ''}]
                  </p>
                  {numbers.length > 20 && (
                    <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '8px' }}>
                      Showing first 20 values of {numbers.length} total
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Steps Tab */}
            {activeTab === 'steps' && steps.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {steps.map((step, index) => (
                  <div key={index} style={{
                    padding: '16px',
                    borderRadius: '16px',
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0'
                  }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: 'white',
                        flexShrink: 0
                      }}>
                        {index + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#0F172A', marginBottom: '8px' }}>
                          {step.title}
                        </h3>
                        <p style={{ fontSize: '13px', color: '#475569', marginBottom: '8px', lineHeight: '1.5' }}>
                          {step.description}
                        </p>
                        <div style={{
                          background: 'white',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          fontFamily: 'monospace',
                          fontSize: '12px',
                          color: '#D97706',
                          border: '1px solid #FDE68A'
                        }}>
                          📐 {step.formula}
                        </div>
                        <button
                          onClick={() => speakText(step.voiceText || `${step.title}. ${step.description}`)}
                          style={{
                            marginTop: '8px',
                            padding: '4px 10px',
                            background: '#FEF3C7',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '11px',
                            color: '#D97706'
                          }}
                        >
                          🔊 Listen
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for statistic cards
function StatCard({ title, value, color }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '14px',
      padding: '16px',
      border: '1px solid #E2E8F0',
      transition: 'all 0.2s'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}>
      <div style={{ fontSize: '12px', fontWeight: '500', color: '#64748B', marginBottom: '8px' }}>{title}</div>
      <div style={{ fontSize: '20px', fontWeight: '700', color: color || '#0F172A' }}>{value}</div>
    </div>
  );
}