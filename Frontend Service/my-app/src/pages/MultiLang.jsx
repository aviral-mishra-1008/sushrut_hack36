import React, { useState, useRef } from "react";

const MultiLang = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");
  const recognitionRef = useRef(null);
  const silenceTimeoutRef = useRef(null);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const lastSpeechRef = useRef(Date.now());

  // Predefined list of major languages
  const availableLanguages = [
    // English (Default)
    { code: "en-US", name: "English (US)" },
    { code: "en-GB", name: "English (UK)" },
    // Indian languages
    { code: "hi-IN", name: "Hindi" },
    { code: "bn-IN", name: "Bengali" },
    { code: "te-IN", name: "Telugu" },
    { code: "ta-IN", name: "Tamil" },
    { code: "mr-IN", name: "Marathi" },
    { code: "gu-IN", name: "Gujarati" },
    { code: "kn-IN", name: "Kannada" },
    { code: "ml-IN", name: "Malayalam" },
    { code: "pa-IN", name: "Punjabi" },
    // European languages
    { code: "de-DE", name: "German" },
    { code: "fr-FR", name: "French" },
    { code: "es-ES", name: "Spanish" },
    { code: "ru-RU", name: "Russian" },
  ];

  const SILENCE_DURATION = 3000; // 3 seconds

  const resetSilenceTimeout = () => {
    lastSpeechRef.current = Date.now();

    if (silenceTimeoutRef.current) {
      clearInterval(silenceTimeoutRef.current);
    }

    silenceTimeoutRef.current = setInterval(() => {
      const timeSinceLastSpeech = Date.now() - lastSpeechRef.current;
      if (timeSinceLastSpeech >= SILENCE_DURATION) {
        if (recognitionRef.current) {
          console.log("Silence detected - stopping");
          recognitionRef.current.stop();
          setIsButtonVisible(true);
          if (silenceTimeoutRef.current) {
            clearInterval(silenceTimeoutRef.current);
          }
        }
      }
    }, 1000);
  };

  const startListening = () => {
    setIsButtonVisible(false);
    setTranscript("");

    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      alert(
        "Speech recognition is not supported in this browser. Please use Chrome."
      );
      setIsButtonVisible(true);
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = selectedLanguage;

    recognition.onstart = () => {
      console.log("Speech recognition started in:", selectedLanguage);
      setIsListening(true);
      lastSpeechRef.current = Date.now();
      resetSilenceTimeout();
    };

    recognition.onresult = (event) => {
      lastSpeechRef.current = Date.now();
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      const fullTranscript = finalTranscript || interimTranscript;
      setTranscript(fullTranscript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      setIsButtonVisible(true);
      if (silenceTimeoutRef.current) {
        clearInterval(silenceTimeoutRef.current);
      }
    };

    recognition.onend = () => {
      console.log("Speech recognition ended");
      setIsListening(false);
      if (silenceTimeoutRef.current) {
        clearInterval(silenceTimeoutRef.current);
      }
    };

    try {
      recognition.start();
    } catch (err) {
      console.error("Error starting recognition:", err);
      setIsButtonVisible(true);
    }
  };

  React.useEffect(() => {
    return () => {
      if (silenceTimeoutRef.current) {
        clearInterval(silenceTimeoutRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-purple-800 to-pink-700 p-6 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-purple-900/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-bold mb-8 text-white text-center">
          Multilingual Speech Recognition
        </h2>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full sm:w-64 px-4 py-3 rounded-xl 
                                     bg-purple-800/50 text-white
                                     border border-purple-600
                                     focus:ring-2 focus:ring-blue-400 focus:border-transparent
                                     transition-all duration-200 outline-none"
            >
              <optgroup label="English" className="font-semibold">
                {availableLanguages
                  .filter((lang) => lang.code.startsWith("en"))
                  .map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Indian Languages" className="font-semibold">
                {availableLanguages
                  .filter((lang) => lang.code.endsWith("-IN"))
                  .map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="European Languages" className="font-semibold">
                {availableLanguages
                  .filter(
                    (lang) =>
                      !lang.code.startsWith("en") && !lang.code.endsWith("-IN")
                  )
                  .map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
              </optgroup>
            </select>

            {isButtonVisible && (
              <button
                onClick={startListening}
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 
                                         hover:bg-blue-700 text-white font-semibold
                                         rounded-xl shadow-lg hover:shadow-blue-500/20
                                         transition-all duration-200 focus:outline-none 
                                         focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
                                         focus:ring-offset-purple-900"
              >
                Start Listening
              </button>
            )}
          </div>

          {isListening && (
            <p className="text-blue-400 text-center font-medium animate-pulse">
              🎤 Listening in{" "}
              {
                availableLanguages.find(
                  (lang) => lang.code === selectedLanguage
                )?.name
              }
              ...
            </p>
          )}

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">
              Recognized Text:
            </h3>
            <div
              className="min-h-[150px] p-4 rounded-xl bg-purple-800/50 text-white font-mono
                                      border border-purple-600 shadow-inner"
            >
              {transcript ||
                `Start speaking in ${
                  availableLanguages.find(
                    (lang) => lang.code === selectedLanguage
                  )?.name
                }...`}
            </div>
          </div>

          {!isListening && transcript && (
            <div className="text-center">
              <button
                onClick={() => {
                  setTranscript("");
                  setIsButtonVisible(true);
                }}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white 
                                         rounded-xl transition-colors duration-200 font-medium
                                         focus:outline-none focus:ring-2 focus:ring-purple-400
                                         focus:ring-offset-2 focus:ring-offset-purple-900"
              >
                Clear & Reset
              </button>
            </div>
          )}

          <div className="mt-6 space-y-2 text-sm text-purple-200">
            <p className="flex items-center justify-center gap-2">
              <span className="font-medium">Status:</span>
              <span
                className={`inline-flex items-center ${
                  isListening ? "text-blue-400" : "text-pink-400"
                }`}
              >
                {isListening ? (
                  <>
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse mr-2"></span>
                    Listening
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 bg-pink-400 rounded-full mr-2"></span>
                    Not Listening
                  </>
                )}
              </span>
            </p>
            <p className="text-center">
              <span className="font-medium">Selected Language: </span>
              {
                availableLanguages.find(
                  (lang) => lang.code === selectedLanguage
                )?.name
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiLang;