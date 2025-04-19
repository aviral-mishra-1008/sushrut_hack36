import React, { useState } from 'react';
import textToSpeech from '../utility/textToSpeech';

const TextToSpeech = () => {
  const [text, setText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      textToSpeech({
        text: text.trim(),
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: (error) => {
          console.error('Speech error:', error);
          setIsSpeaking(false);
        }
      });
    }
  };

  const stopSpeaking = () => {
    textToSpeech({ text: '' }).stop();
    setIsSpeaking(false);
  };

  // Rest of your component remains the same
  return (
   <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Text to Speech Converter
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to convert to speech..."
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
        />
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isSpeaking || !text.trim()}
            className={`px-4 py-2 rounded-md text-white ${
              isSpeaking || !text.trim()
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isSpeaking ? "Speaking..." : "Speak"}
          </button>
          {isSpeaking && (
            <button
              type="button"
              onClick={stopSpeaking}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Stop
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TextToSpeech;