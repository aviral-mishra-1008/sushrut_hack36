/**
 * Utility function for text-to-speech conversion
 * @param {string} text - The text to convert to speech
 * @param {Object} options - Optional configuration for speech synthesis
 * @param {Function} onStart - Callback function when speech starts
 * @param {Function} onEnd - Callback function when speech ends
 * @param {Function} onError - Callback function when an error occurs
 * @returns {Object} - Control methods for the speech synthesis
 */
const textToSpeech = ({
  text,
  options = {},
  onStart = () => {},
  onEnd = () => {},
  onError = () => {},
}) => {
  // Validate input
  if (!text || typeof text !== "string") {
    throw new Error("Text is required and must be a string");
  }

  try {
    // Check if speech synthesis is supported
    if (!("speechSynthesis" in window)) {
      throw new Error("Speech synthesis not supported in this browser");
    }

    // Create and configure utterance
    const utterance = new SpeechSynthesisUtterance(text);

    // Apply options if provided
    Object.assign(utterance, options);

    // Set up event handlers
    utterance.onstart = onStart;
    utterance.onend = onEnd;
    utterance.onerror = onError;

    // Start speaking
    speechSynthesis.speak(utterance);

    // Return control methods
    return {
      stop: () => speechSynthesis.cancel(),
      pause: () => speechSynthesis.pause(),
      resume: () => speechSynthesis.resume(),
      speaking: () => speechSynthesis.speaking,
    };
  } catch (error) {
    onError(error);
    throw error;
  }
};

export default textToSpeech;
