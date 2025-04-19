import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

// Global variables to store base64 data
let globalAudioBase64 = null;
let globalImageBase64 = null;

const LoginDA = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState("welcome");
  const [capturedImage, setCapturedImage] = useState(null);
  const [audioRecording, setAudioRecording] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

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

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
      const imageDataUrl = canvas.toDataURL("image/jpeg");

      // Convert to base64 and store globally
      globalImageBase64 = imageDataUrl.split(',')[1];
      
      // Convert to Blob for preview
      fetch(imageDataUrl)
        .then((res) => res.blob())
        .then((blob) => {
          setCapturedImage(blob);
          console.log("Photo captured successfully");
        });

      // Stop video stream
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

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
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioRecording(audioBlob);

        // Convert to base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          globalAudioBase64 = reader.result.split(',')[1];
          console.log("Audio recorded and converted to base64");
        };
      };

      mediaRecorderRef.current.start();
      console.log("Started recording audio");
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

  const submitData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://your-endpoint/api/auth/login-biometric",
        {
          audioData: globalAudioBase64,
          imageData: globalImageBase64,
          timestamp: new Date().toISOString(),
        }
      );

      console.log("Login response:", response.data);
      toast.success("Login successful!");

      // Store user data and redirect
      localStorage.setItem('userData', JSON.stringify(response.data));
      
      setTimeout(() => {
        if (response.data.role === "PATIENT") {
          navigate("/patient/dashboard");
        } else {
          navigate("/doctor/dashboard");
        }
      }, 1500);

    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const proceedToNextStep = () => {
    const steps = {
      welcome: "audio",
      audio: "photo",
      photo: "submit",
    };
    setCurrentStep(steps[currentStep]);

    if (steps[currentStep] === "audio") {
      startAudioRecording();
      speak("Please speak for voice verification.");
    } else if (steps[currentStep] === "photo") {
      startCamera();
      speak("Please look at the camera for photo verification.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700 p-8">
      <motion.div
        className="max-w-md mx-auto bg-white rounded-xl shadow-2xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Touchless Login
        </h1>

        <div className="space-y-6">
          {/* Current Step Display */}
          <div className="text-sm text-gray-500 text-center">
            Step: {currentStep.charAt(0).toUpperCase() + currentStep.slice(1)}
          </div>

          {/* Step Content */}
          {currentStep === "welcome" && (
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                Welcome to touchless login. Please proceed with voice and face verification.
              </p>
            </div>
          )}

          {currentStep === "audio" && (
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-gray-700">Recording your voice...</p>
              </div>
              {audioRecording && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-700">Voice recorded successfully!</p>
                </div>
              )}
              <button
                onClick={stopAudioRecording}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg 
                       hover:bg-purple-700 transition-colors"
              >
                Stop Recording
              </button>
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
                    <p className="text-green-700">Photo captured successfully!</p>
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

          {/* Navigation Buttons */}
          <div className="flex justify-center">
            {currentStep === "welcome" && (
              <button
                onClick={proceedToNextStep}
                className="w-full bg-purple-600 text-white py-2 px-6 rounded-lg 
                       hover:bg-purple-700 transition-colors"
              >
                Start Verification
              </button>
            )}

            {(currentStep === "audio" && audioRecording) && (
              <button
                onClick={proceedToNextStep}
                className="w-full bg-purple-600 text-white py-2 px-6 rounded-lg 
                       hover:bg-purple-700 transition-colors"
              >
                Next
              </button>
            )}

            {(currentStep === "photo" && capturedImage) && (
              <button
                onClick={submitData}
                disabled={loading}
                className={`w-full py-2 px-6 rounded-lg text-white
                        ${loading 
                          ? "bg-gray-400 cursor-not-allowed" 
                          : "bg-purple-600 hover:bg-purple-700"} 
                        transition-colors`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Verifying...
                  </div>
                ) : (
                  "Complete Login"
                )}
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

export default LoginDA;