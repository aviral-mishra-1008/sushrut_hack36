import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

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
    const validStates = Array.from(this.model.keys()).filter((state) =>
      state.split(",").includes(seedWord.toLowerCase())
    );

    if (validStates.length === 0) {
      return `Could not find seed word '${seedWord}' in the model.`;
    }

    // Generate text
    let currentState =
      validStates[Math.floor(Math.random() * validStates.length)];
    let result = currentState.split(",");

    for (let i = 0; i < length - this.order; i++) {
      const possibleNextWords = this.model.get(currentState);
      if (!possibleNextWords) break;

      const nextWord =
        possibleNextWords[Math.floor(Math.random() * possibleNextWords.length)];
      result.push(nextWord);
      currentState = result.slice(-this.order).join(",");
    }

    return result.join(" ");
  }
}
const SignUpDA = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState("welcome");
  const [isListening, setIsListening] = useState(false);
  const [verificationText, setVerificationText] = useState("");
  // Global states for media data
  const [globalBase64Image, setGlobalBase64Image] = useState(null);
  const [globalAudioRecording, setGlobalAudioRecording] = useState(null);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "SecurePass@2025",
    verificationString: "",
    userId: null,
    // Additional hardcoded fields
    gender: "Male",
    role: "PATIENT",
    bloodGroup: "O+",
    height: 175.5,
    weight: 70.2,
    diseases: ["Diabetes", "Hypertension"],
    familyDiseases: ["Heart Disease"],
    allergies: ["Pollen", "Dust"],
  });
  const [capturedImage, setCapturedImage] = useState(null);
  const [audioRecording, setAudioRecording] = useState(null);
  const [message, setMessage] = useState("");

  const [textGenerator, setTextGenerator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };
  // New function to handle audio recording
  const startAudioRecording = async () => {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      mediaRecorderRef.current = new MediaRecorder(audioStream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        console.log("HI");
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioRecording(audioBlob);
        // Convert audio blob to base64
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Audio = reader.result.split(",")[1];
          setGlobalAudioRecording(base64Audio);
          console.log("Audio recorded and stored as base64",base64Audio);
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorderRef.current.start();
      console.log("Started recording verification audio");
    } catch (error) {
      console.error("Error starting audio recording:", error);
      speak("Failed to access microphone. Please check permissions.");
    }
  };
  const stopAudioRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      const tracks = mediaRecorderRef.current.stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = "en-US";

    // Start audio recording when verification step begins
    if (currentStep === "verify") {
      startAudioRecording();
    }

    recognitionRef.current.onstart = () => {
      setIsListening(true);
    };

    recognitionRef.current.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");

      // Update the appropriate field based on current step
      switch (currentStep) {
        case "name":
          setUserData((prev) => ({ ...prev, name: transcript }));
          break;
        case "email":
          setUserData((prev) => ({
            ...prev,
            email: transcript.toLowerCase().replace(/\s+/g, ""),
          }));
          break;
        case "phone":
          setUserData((prev) => ({
            ...prev,
            phoneNumber: transcript.replace(/\D/g, ""),
          }));
          break;
        case "verify":
          if (
            transcript
              .toLowerCase()
              .includes(userData.verificationString.toLowerCase())
          ) {
            stopAudioRecording();
            stopListening();
            proceedToNextStep();
          }
          break;
        default:
          break;
      }
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error("Error starting recognition:", error);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  //   const startCamera = async () => {
  //     try {
  //       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  //       if (videoRef.current) {
  //         videoRef.current.srcObject = stream;
  //       }

  //       // Start recording audio
  //       const audioStream = await navigator.mediaDevices.getUserMedia({
  //         audio: true,
  //       });
  //       mediaRecorderRef.current = new MediaRecorder(audioStream);

  //       mediaRecorderRef.current.ondataavailable = (e) => {
  //         chunksRef.current.push(e.data);
  //       };

  //       mediaRecorderRef.current.onstop = () => {
  //         const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
  //         setAudioRecording(audioBlob);
  //         chunksRef.current = [];
  //       };

  //       mediaRecorderRef.current.start();
  //     } catch (error) {
  //       console.error("Error accessing camera:", error);
  //       setMessage(
  //         "Failed to access camera. Please ensure camera permissions are granted."
  //       );
  //       speak(
  //         "Failed to access camera. Please ensure camera permissions are granted."
  //       );
  //     }
  //   };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setMessage("Failed to access camera. Please check permissions.");
      speak("Failed to access camera. Please check permissions.");
    }
  };

  //   const capturePhoto = () => {
  //     if (videoRef.current) {
  //       const canvas = document.createElement("canvas");
  //       canvas.width = videoRef.current.videoWidth;
  //       canvas.height = videoRef.current.videoHeight;
  //       canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
  //       const imageDataUrl = canvas.toDataURL("image/jpeg");
  //       setCapturedImage(imageDataUrl);

  //       // Stop video stream and audio recording
  //       const tracks = videoRef.current.srcObject.getTracks();
  //       tracks.forEach((track) => track.stop());
  //       if (
  //         mediaRecorderRef.current &&
  //         mediaRecorderRef.current.state !== "inactive"
  //       ) {
  //         mediaRecorderRef.current.stop();
  //       }
  //     }
  //   };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
      // Get base64 string directly
      const base64Image = canvas.toDataURL("image/jpeg").split(",")[1];
      setCapturedImage(true);
      setGlobalBase64Image(base64Image);
      console.log("Photo captured as base64", base64Image);

      // Stop video stream
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };
  const submitData = async () => {
    try {
      const userid = "36630102-9f82-42c5-aaaf-cfaaed2895be";
      // First API call to backend
      const backendResponse = await axios.post(
        "http://localhost:8080/api/auth/patient/signup",
        {
          name:userData.name.replace(/\./g, '').trim(),
          email: userData.email.replace(/\./g, '').trim(),
          phNumber: userData.phoneNumber.replace(/\./g, '').trim(),
          password: "SecurePass@2025",
          gender: "Male",
          role: "PATIENT",
          bloodGroup: "O+",
          height: 175.5,
          weight: 70.2,
          diseases: ["Diabetes", "Hypertension"],
          familyDiseases: ["Heart Disease"],
          allergies: ["Pollen", "Dust"],
        }
      );
      console.log("Backend registration response:", backendResponse.data);
      // Verify we have both image and audio
      if (!globalBase64Image || !globalAudioRecording) {
        throw new Error("Missing image or audio recording");
      }
       console.log("global audio",globalAudioRecording);
       console.log("global image",globalBase64Image);
       // Send to LLM endpoint with base64 data
    const llmResponse = await axios.post(
      "http://localhost:8000/register_user",
      {
        userID: "36630102-9f82-42c5-aaaf-cfaaed2895be",
        image_file: globalBase64Image,
        audio_file: globalAudioRecording,
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (llmResponse.data.success) {
      // Clear sensitive data
      setGlobalBase64Image(null);
      setGlobalAudioRecording(null);
      
      speak("Registration successful! Redirecting to dashboard...");
      setTimeout(() => navigate("/dashboard"), 2000);
    } else {
      throw new Error("LLM processing failed");
    }

  } catch (error) {
    console.error("Error during registration:", error);
    const errorMessage = error.response?.data?.message || 
      "Sorry, there was an error during registration. Please try again.";
    speak(errorMessage);
    
  }
  };

  const proceedToNextStep = () => {
    const steps = {
      welcome: "name",
      name: "email",
      email: "phone",
      phone: "verify",
      verify: "photo",
      photo: "submit",
    };
    setCurrentStep(steps[currentStep]);
  };
  // Load the model and generate verification text when component mounts
  useEffect(() => {
    fetch("react_markov_model.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load model");
        }
        return response.json();
      })
      .then((modelData) => {
        const generator = new MarkovGenerator(modelData);
        setTextGenerator(generator);

        // Generate text with hardcoded values
        const generatedText = generator.generateText("medicine", 5);

        // Update userData with the generated text
        setUserData((prev) => ({
          ...prev,
          verificationString: generatedText,
        }));

        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const stepMessages = {
      welcome: "Welcome! Let's get you signed up.",
      name: "Please say your full name.",
      email: "Now, say your email address.",
      phone: "Say your phone number.",
      verify: `Please repeat the verification sentence: ${userData.verificationString}`,
      photo: "Look at the camera to capture your photo and voice.",
      submit: "Submitting your information...",
    };

    const timer = setTimeout(() => {
      speak(stepMessages[currentStep] || "");
    }, 1000);

    if (currentStep === "photo") {
      startCamera();
    } else if (currentStep !== "welcome" && currentStep !== "submit") {
      startListening();
    }

    return () => {
      clearTimeout(timer);
      stopListening();
    };
  }, [currentStep, userData.verificationString]);

  // Rest of your existing code remains the same...

  // Update your return statement to handle loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700 p-8">
        <motion.div
          className="max-w-md mx-auto bg-white rounded-xl shadow-2xl p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center">Loading verification system...</div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700 p-8">
        <motion.div
          className="max-w-md mx-auto bg-white rounded-xl shadow-2xl p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center text-red-600">Error: {error}</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700 p-8">
      <motion.div
        className="max-w-md mx-auto bg-white rounded-xl shadow-2xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Voice-Assisted Registration
        </h1>

        <div className="space-y-6">
          {/* Current Step Display */}
          <div className="text-sm text-gray-500 text-center">
            Step: {currentStep.charAt(0).toUpperCase() + currentStep.slice(1)}
          </div>

          {/* Status Message */}
          <div className="text-center text-gray-600">
            {isListening && (
              <motion.div
                className="text-purple-600"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Listening...
              </motion.div>
            )}
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {currentStep === "name" && (
              <div className="form-field">
                <label className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={userData.name}
                  readOnly
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            )}

            {currentStep === "email" && (
              <div className="form-field">
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={userData.email}
                  readOnly
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            )}

            {currentStep === "phone" && (
              <div className="form-field">
                <label className="block text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={userData.phoneNumber}
                  readOnly
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            )}

            {currentStep === "verify" && (
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-gray-700">Verification Phrase:</p>
                  <p className="text-purple-600 font-medium mt-2">
                    {userData.verificationString}
                  </p>
                </div>
                {isListening ? (
                  <motion.div
                    className="text-purple-600 text-center"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Listening for verification phrase...
                  </motion.div>
                ) : audioRecording ? (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-green-700">
                      Verification audio recorded successfully!
                    </p>
                  </div>
                ) : null}
              </div>
            )}

            {currentStep === "photo" && (
              <div className="space-y-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-lg"
                />
                {!capturedImage ? (
                  <button
                    onClick={capturePhoto}
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg 
                   hover:bg-purple-700 transition-colors"
                  >
                    Capture Photo
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-green-700">
                        Photo captured successfully!
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setCapturedImage(null);
                        startCamera();
                      }}
                      className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg 
                     hover:bg-gray-700 transition-colors"
                    >
                      Retake Photo
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            {currentStep === "welcome" && (
              <button
                onClick={proceedToNextStep}
                className="w-full bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Start Registration
              </button>
            )}

            {currentStep !== "welcome" && currentStep !== "submit" && (
              <button
                onClick={proceedToNextStep}
                className="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Next
              </button>
            )}

            {currentStep === "submit" && (
              <button
                onClick={submitData}
                className="w-full bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors"
              >
                Complete Registration
              </button>
            )}
          </div>

          {message && (
            <div className="mt-4 text-center text-sm text-red-500">
              {message}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpDA;