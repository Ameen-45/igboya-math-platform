import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function DataAnalyzer() {
  const [dataset, setDataset] = useState('');
  const [numbers, setNumbers] = useState([]);
  const [results, setResults] = useState(null);
  const [steps, setSteps] = useState([]);
  const [activeTab, setActiveTab] = useState('input');

  // Sample datasets for quick testing
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
      alert('Please enter a dataset');
      return;
    }

    const data = parseDataset(dataset);
    if (data.length === 0) {
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
      formula: 'Sort numbers in ascending order'
    });

    // Step 2: Calculate Mean
    const sum = data.reduce((a, b) => a + b, 0);
    const mean = sum / data.length;
    newSteps.push({
      title: 'Step 2: Calculate Mean (Average)',
      description: `Sum all values and divide by count: ${data.join(' + ')} = ${sum} ÷ ${data.length} = ${mean.toFixed(2)}`,
      formula: 'Mean = (Σx) / n'
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
        formula: 'Median = middle value(s) average'
      });
    } else {
      median = sortedData[mid];
      newSteps.push({
        title: 'Step 3: Calculate Median',
        description: `Odd number of values: Middle value = ${median}`,
        formula: 'Median = middle value'
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
      } else if (frequency[num] === maxFreq) {
        modes.push(parseFloat(num));
      }
    });

    const modeText = maxFreq > 1 ? 
      `Value(s) ${modes.join(', ')} appear ${maxFreq} times each` : 
      'No mode (all values are unique)';
    
    newSteps.push({
      title: 'Step 4: Calculate Mode',
      description: modeText,
      formula: 'Mode = most frequent value(s)'
    });
    newResults.mode = modes;
    newResults.modeFrequency = maxFreq;

    // Step 5: Calculate Range
    const range = sortedData[sortedData.length - 1] - sortedData[0];
    newSteps.push({
      title: 'Step 5: Calculate Range',
      description: `Max - Min = ${sortedData[sortedData.length - 1]} - ${sortedData[0]} = ${range.toFixed(2)}`,
      formula: 'Range = Maximum - Minimum'
    });
    newResults.range = range;

    // Step 6: Calculate Standard Deviation
    const squaredDiffs = data.map(num => Math.pow(num - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / data.length;
    const stdDev = Math.sqrt(variance);
    
    newSteps.push({
      title: 'Step 6: Calculate Standard Deviation',
      description: `Variance = ${variance.toFixed(2)}, Standard Deviation = √${variance.toFixed(2)} = ${stdDev.toFixed(2)}`,
      formula: 'σ = √[Σ(x - μ)² / n]'
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
      formula: 'IQR = Q3 - Q1'
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
  };

  const clearData = () => {
    setDataset('');
    setResults(null);
    setSteps([]);
    setActiveTab('input');
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-orange-600">Dashboard</Link>
        <span>›</span>
        <Link to="/topics" className="hover:text-orange-600">Topics</Link>
        <span>›</span>
        <Link to="/topics/statistics" className="hover:text-orange-600">Statistics</Link>
        <span>›</span>
        <span className="text-orange-600 font-medium">Data Analyzer</span>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl text-white text-2xl mb-4">
          🧪
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-800 mb-4">
          Data Analyzer
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Enter your dataset and get comprehensive statistical analysis with step-by-step explanations.
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === 'input' 
                ? 'text-orange-600 border-b-2 border-orange-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('input')}
          >
            📊 Input Data
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === 'results' 
                ? 'text-orange-600 border-b-2 border-orange-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => results && setActiveTab('results')}
            disabled={!results}
          >
            📈 Results
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === 'steps' 
                ? 'text-orange-600 border-b-2 border-orange-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => results && setActiveTab('steps')}
            disabled={!results}
          >
            🔍 Step by Step
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Input Tab */}
          {activeTab === 'input' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your dataset (comma-separated values):
                </label>
                <textarea
                  value={dataset}
                  onChange={(e) => setDataset(e.target.value)}
                  placeholder="e.g., 85, 92, 78, 96, 88, 76, 95, 89, 91, 84"
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-vertical"
                  rows="4"
                />
              </div>

              {/* Sample Datasets */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick sample datasets:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.keys(sampleDatasets).map((name) => (
                    <button
                      key={name}
                      onClick={() => loadSampleData(name)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={calculateStatistics}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                >
                  Analyze Data
                </button>
                <button
                  onClick={clearData}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                >
                  Clear Data
                </button>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-800 mb-2">How to use:</h3>
                <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
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
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard title="Count" value={results.count} />
                <StatCard title="Mean" value={results.mean.toFixed(2)} />
                <StatCard title="Median" value={results.median.toFixed(2)} />
                <StatCard 
                  title="Mode" 
                  value={results.modeFrequency > 1 ? results.mode.join(', ') : 'No mode'} 
                />
                <StatCard title="Range" value={results.range.toFixed(2)} />
                <StatCard title="Std Dev" value={results.stdDev.toFixed(2)} />
                <StatCard title="Variance" value={results.variance.toFixed(2)} />
                <StatCard title="Min" value={results.min.toFixed(2)} />
                <StatCard title="Max" value={results.max.toFixed(2)} />
                <StatCard title="Sum" value={results.sum.toFixed(2)} />
                <StatCard title="Q1" value={results.quartiles.q1.toFixed(2)} />
                <StatCard title="Q3" value={results.quartiles.q3.toFixed(2)} />
                <StatCard title="IQR" value={results.quartiles.iqr.toFixed(2)} />
              </div>

              {/* Data Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-2">Data Summary</h3>
                <p className="text-sm text-gray-600">
                  <strong>Original Data:</strong> [{numbers.join(', ')}]
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Sorted Data:</strong> [{results.sortedData.join(', ')}]
                </p>
              </div>
            </div>
          )}

          {/* Steps Tab */}
          {activeTab === 'steps' && steps.length > 0 && (
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 mb-1">{step.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                      <div className="bg-gray-100 rounded px-3 py-1 text-xs font-mono text-gray-700">
                        {step.formula}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper component for statistic cards
function StatCard({ title, value }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="text-sm font-medium text-gray-500 mb-1">{title}</div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
    </div>
  );
}