import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("patient");
  const [formData, setFormData] = useState({
    // Common fields
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    gender: "",
    // Patient specific fields
    bloodGroup: "",
    height: "",
    weight: "",
    diseasesList: "",
    familyDiseasesList: "",
    allergiesList: "",
    // Doctor specific fields
    licenseNumber: "",
    department: "",
    experienceYears: "",
    consultationFee: "",
    qualification: "",
    hospitalName: "",
    address: "",
    city: "",
    state: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        role,
        signupDate: new Date().toISOString(),
        ...(role === "patient" && {
          diseasesList: formData.diseasesList
            ? formData.diseasesList.split(",").map((item) => item.trim())
            : [],
          familyDiseasesList: formData.familyDiseasesList
            ? formData.familyDiseasesList.split(",").map((item) => item.trim())
            : [],
          allergiesList: formData.allergiesList
            ? formData.allergiesList.split(",").map((item) => item.trim())
            : [],
        }),
      };

      const response = await axios.post("/api/signup", payload);
      toast.success("Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Signup failed. Please try again."
      );
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const commonInputClasses =
    "w-full px-4 py-3 rounded-lg bg-gray-100/10 border border-gray-200/20 focus:border-blue-500/50 focus:bg-gray-100/20 focus:outline-none transition-all text-white placeholder-gray-400";

  return (
    <div className="min-h-screen flex items-center justify-center flex-col bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700 p-4">
      <motion.div
        className="bg-black/40 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">Sign Up</h2>
          <Link
            to="/login"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Already have an account? Login
          </Link>
        </div>

        {/* Role Selection */}
        <div className="flex gap-4 mb-8">
          <motion.button
            type="button"
            className={`flex-1 py-3 rounded-lg transition-all duration-300 ${
              role === "patient"
                ? "bg-blue-600/90 text-white"
                : "bg-gray-100/10 text-gray-200 hover:bg-gray-100/20"
            }`}
            onClick={() => setRole("patient")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Patient
          </motion.button>
          <motion.button
            type="button"
            className={`flex-1 py-3 rounded-lg transition-all duration-300 ${
              role === "doctor"
                ? "bg-blue-600/90 text-white"
                : "bg-gray-100/10 text-gray-200 hover:bg-gray-100/20"
            }`}
            onClick={() => setRole("doctor")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Doctor
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Common Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className={commonInputClasses}
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <input
                type="email"
                name="email"
                placeholder="Email"
                className={commonInputClasses}
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <input
                type="password"
                name="password"
                placeholder="Password"
                className={commonInputClasses}
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                className={commonInputClasses}
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
              />
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <select
                name="gender"
                className={commonInputClasses}
                value={formData.gender}
                onChange={handleInputChange}
                required
              >
                <option value="" className="bg-gray-800">
                  Select Gender
                </option>
                <option value="male" className="bg-gray-800">
                  Male
                </option>
                <option value="female" className="bg-gray-800">
                  Female
                </option>
                <option value="other" className="bg-gray-800">
                  Other
                </option>
              </select>
            </motion.div>
          </div>

          {/* Role Specific Fields */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {role === "patient" ? (
              <>
                <select
                  name="bloodGroup"
                  className={commonInputClasses}
                  value={formData.bloodGroup}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" className="bg-gray-800">
                    Select Blood Group
                  </option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                    (group) => (
                      <option key={group} value={group} className="bg-gray-800">
                        {group}
                      </option>
                    )
                  )}
                </select>

                <input
                  type="number"
                  name="height"
                  placeholder="Height (cm)"
                  className={commonInputClasses}
                  value={formData.height}
                  onChange={handleInputChange}
                  required
                />

                <input
                  type="number"
                  name="weight"
                  placeholder="Weight (kg)"
                  className={commonInputClasses}
                  value={formData.weight}
                  onChange={handleInputChange}
                  required
                />

                <div className="md:col-span-2">
                  <textarea
                    name="diseasesList"
                    placeholder="Diseases (comma separated)"
                    className={commonInputClasses}
                    value={formData.diseasesList}
                    onChange={handleInputChange}
                    rows="2"
                  />
                </div>

                <div className="md:col-span-2">
                  <textarea
                    name="familyDiseasesList"
                    placeholder="Family Diseases (comma separated)"
                    className={commonInputClasses}
                    value={formData.familyDiseasesList}
                    onChange={handleInputChange}
                    rows="2"
                  />
                </div>

                <div className="md:col-span-2">
                  <textarea
                    name="allergiesList"
                    placeholder="Allergies (comma separated)"
                    className={commonInputClasses}
                    value={formData.allergiesList}
                    onChange={handleInputChange}
                    rows="2"
                  />
                </div>
              </>
            ) : (
              <>
                <input
                  type="text"
                  name="licenseNumber"
                  placeholder="License Number"
                  className={commonInputClasses}
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  required
                />

                <input
                  type="text"
                  name="department"
                  placeholder="Department"
                  className={commonInputClasses}
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                />

                <input
                  type="number"
                  name="experienceYears"
                  placeholder="Years of Experience"
                  className={commonInputClasses}
                  value={formData.experienceYears}
                  onChange={handleInputChange}
                  required
                />

                <input
                  type="number"
                  name="consultationFee"
                  placeholder="Consultation Fee"
                  className={commonInputClasses}
                  value={formData.consultationFee}
                  onChange={handleInputChange}
                  required
                />

                <input
                  type="text"
                  name="qualification"
                  placeholder="Qualification"
                  className={commonInputClasses}
                  value={formData.qualification}
                  onChange={handleInputChange}
                  required
                />

                <input
                  type="text"
                  name="hospitalName"
                  placeholder="Hospital Name"
                  className={commonInputClasses}
                  value={formData.hospitalName}
                  onChange={handleInputChange}
                  required
                />

                <div className="md:col-span-2">
                  <textarea
                    name="address"
                    placeholder="Address"
                    className={commonInputClasses}
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="2"
                    required
                  />
                </div>

                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  className={commonInputClasses}
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />

                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  className={commonInputClasses}
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
              </>
            )}
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
                Signing up...
              </div>
            ) : (
              "Sign Up"
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Signup;
