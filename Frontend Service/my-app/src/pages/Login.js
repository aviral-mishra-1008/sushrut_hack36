import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("patient");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your login logic here
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          email: formData.email,
          password: formData.password,
          role: role,
        }
      );
      console.log("Login response:", response.data);
      toast.success("Login successful!");

      setFormData({
        email: "",
        password: "",
      });

      // Redirect based on role (adjust paths as needed)
      setTimeout(() => {
        if (role === "patient") {
          navigate("/patient/dashboard");
        } else {
          navigate("/doctor/dashboard");
        }
      }, 1500);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);

      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center flex-col bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700 p-4">
      <motion.div
        className="bg-black/40 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-center text-white mb-8">
          Login
        </h2>

        <div className="flex gap-4 mb-6">
          <button
            className={`flex-1 py-2 rounded-lg transition-all duration-300 ${
              role === "patient"
                ? "bg-blue-600/90 text-white"
                : "bg-gray-100/10 text-gray-200 hover:bg-gray-100/20"
            }`}
            onClick={() => setRole("patient")}
          >
            Patient
          </button>
          <button
            className={`flex-1 py-2 rounded-lg transition-all duration-300 ${
              role === "doctor"
                ? "bg-blue-600/90 text-white"
                : "bg-gray-100/10 text-gray-200 hover:bg-gray-100/20"
            }`}
            onClick={() => setRole("doctor")}
          >
            Doctor
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 rounded-lg bg-gray-100/10 border border-gray-200/20 focus:border-blue-500/50 focus:bg-gray-100/20 focus:outline-none transition-all text-white placeholder-gray-400"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </motion.div>

          <motion.div
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg bg-gray-100/10 border border-gray-200/20 focus:border-blue-500/50 focus:bg-gray-100/20 focus:outline-none transition-all text-white placeholder-gray-400"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </motion.div>

          <motion.button
            type="submit"
            className={`w-full py-3 rounded-lg transition-all duration-300 ${
              loading
                ? "bg-blue-400/50 cursor-not-allowed"
                : "bg-blue-600/80 hover:bg-blue-700/80"
            } text-white`}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            disabled={loading}
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
                Logging in...
              </div>
            ) : (
              "Login"
            )}
          </motion.button>
        </form>
        <Link
          to="/signup"
          className="text-blue-400 hover:text-blue-300 transition-colors duration-300 text-center block mt-4"
        >
          Not have an account? Sign Up
        </Link>
      </motion.div>
    </div>
  );
};

export default Login;
