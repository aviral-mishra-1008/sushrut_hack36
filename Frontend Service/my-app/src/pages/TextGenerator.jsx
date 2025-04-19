import React, { useState, useEffect } from 'react';

class MarkovGenerator {
  constructor(modelData) {
    this.order = modelData.order;
    this.model = this.convertModel(modelData.model);
  }

  convertModel(modelDict) {
    const model = new Map();
    for (const [key, value] of Object.entries(modelDict)) {
      model.set(key, value);
    }
    return model;
  }

  generateText(seedWord, length = 50) {
    // Find valid starting states
    const validStates = Array.from(this.model.keys())
      .filter(state => state.split(',').includes(seedWord.toLowerCase()));

    if (validStates.length === 0) {
      return `Could not find seed word '${seedWord}' in the model.`;
    }

    // Generate text
    let currentState = validStates[Math.floor(Math.random() * validStates.length)];
    let result = currentState.split(',');

    for (let i = 0; i < length - this.order; i++) {
      const possibleNextWords = this.model.get(currentState);
      if (!possibleNextWords) break;

      const nextWord = possibleNextWords[Math.floor(Math.random() * possibleNextWords.length)];
      result.push(nextWord);
      currentState = result.slice(-this.order).join(',');
    }

    return result.join(' ');
  }
}

function TextGenerator() {
  const [model, setModel] = useState(null);
  const [seedWord, setSeedWord] = useState('');
  const [length, setLength] = useState(50);
  const [generatedText, setGeneratedText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load the model when component mounts
    fetch('react_markov_model.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load model');
        }
        return response.json();
      })
      .then(modelData => {
        setModel(new MarkovGenerator(modelData));
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleGenerate = () => {
    if (model && seedWord) {
      const text = model.generateText(seedWord, length);
      setGeneratedText(text);
    }
  };

  if (loading) {
    return <div>Loading model...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="text-generator">
      <h2>Sci-Fi Text Generator</h2>
      <div className="input-section">
        <input
          type="text"
          value={seedWord}
          onChange={(e) => setSeedWord(e.target.value)}
          placeholder="Enter seed word (e.g., space, time, robot)"
          className="seed-input"
        />
        <input
          type="number"
          value={length}
          onChange={(e) => setLength(parseInt(e.target.value))}
          min="10"
          max="200"
          className="length-input"
        />
        <button 
          onClick={handleGenerate}
          disabled={!seedWord}
          className="generate-button"
        >
          Generate Text
        </button>
      </div>
      {generatedText && (
        <div className="output-section">
          <h3>Generated Text:</h3>
          <p className="generated-text">{generatedText}</p>
        </div>
      )}
    </div>
  );
}

export default TextGenerator;