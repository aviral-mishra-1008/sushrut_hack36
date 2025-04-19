import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

   const goToTouchLessMode = () => {
     navigate("/signupDA"); // Navigate to signupDA page
   };
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("patient");
  const [formData, setFormData] = useState({
    // Common fields
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phNumber: "",
    gender: "",
    
    // Patient specific fields
    bloodGroup: "",
    height: "",
    weight: "",
    diseases: "",
    familyDiseases: "",
    allergies: "",
    
    // Doctor specific fields
    licenseNumber: "",
    department: "",
    experienceYears: "",
    consultationFee: "",
    qualification: "",
    hospitalName: "",
    address: "",
    city: "",
    state: ""
  });

  // const validateForm = () => {
  //   // Common validations
  //   if (formData.password !== formData.confirmPassword) {
  //     toast.error("Passwords do not match");
  //     return false;
  //   }

  //   if (formData.password.length < 8) {
  //     toast.error("Password must be at least 8 characters long");
  //     return false;
  //   }

  //   if (!/^\d{10}$/.test(formData.phNumber)) {
  //     toast.error("Please enter a valid 10-digit phone number");
  //     return false;
  //   }

  //   if (role === "patient") {
  //     if (!formData.bloodGroup) {
  //       toast.error("Please select a blood group");
  //       return false;
  //     }
  //     if (parseFloat(formData.height) <= 0) {
  //       toast.error("Please enter a valid height");
  //       return false;
  //     }
  //     if (parseFloat(formData.weight) <= 0) {
  //       toast.error("Please enter a valid weight");
  //       return false;
  //     }
  //   } else {
  //     if (!formData.licenseNumber) {
  //       toast.error("Please enter license number");
  //       return false;
  //     }
  //     if (parseFloat(formData.consultationFee) <= 0) {
  //       toast.error("Please enter a valid consultation fee");
  //       return false;
  //     }
  //     if (parseInt(formData.experienceYears) < 0) {
  //       toast.error("Please enter valid years of experience");
  //       return false;
  //     }
  //   }
  //   return true;
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("HI");

    // if (!validateForm()) return;
    console.log("HI");

    setLoading(true);

    try {
      let payload;
      
      if (role === "patient") {
        payload = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phNumber: formData.phNumber,
          gender: formData.gender.toUpperCase(),
          bloodGroup: formData.bloodGroup,
          height: parseFloat(formData.height),
          weight: parseFloat(formData.weight),
          diseases: formData.diseases ? formData.diseases.split(",").map(item => item.trim()) : [],
          familyDiseases: formData.familyDiseases ? formData.familyDiseases.split(",").map(item => item.trim()) : [],
          allergies: formData.allergies ? formData.allergies.split(",").map(item => item.trim()) : []
        };
      } else {
        payload = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phNumber: formData.phNumber,
          gender: formData.gender.toUpperCase(),
          licenseNumber: formData.licenseNumber,
          department: formData.department,
          experienceYears: parseInt(formData.experienceYears),
          consultationFee: parseFloat(formData.consultationFee),
          qualification: formData.qualification,
          hospitalName: formData.hospitalName,
          address: formData.address,
          city: formData.city,
          state: formData.state
        };
      }

      const endpoint = role === "patient" 
        ? "http://localhost:8080/api/auth/patient/signup"
        : "http://localhost:8080/api/auth/doctor/signup";
      console.log("HI");
      const response = await axios.post(endpoint, payload);
      console.log(response.status);
      toast.success("Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed. Please try again.");
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const commonInputClasses = "w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-gray-400 focus:outline-none transition-all text-gray-800 placeholder-gray-400 bg-white";

  return (
    <div className="min-h-screen flex items-start justify-start p-8 md:p-16 bg-gray-50">
      <motion.div
        className="w-full max-w-xl"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Sign Up</h2>
          <Link
            to="/login"
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            Already have an account? Login
          </Link>
        </div>

        <motion.button
          onClick={goToTouchLessMode}
          className="w-full mb-6 py-3 px-4 bg-purple-600 text-white rounded-lg 
                   flex items-center justify-center gap-2 hover:bg-purple-700 
                   transition-colors duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
          Go to Touchless Mode
        </motion.button>

        {/* Role Selection */}
        <div className="flex gap-4 mb-8">
          <motion.button
            type="button"
            className={`flex-1 py-3 rounded-lg transition-all duration-300 ${
              role === "patient"
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
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
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
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
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className={commonInputClasses}
              value={formData.name}
              onChange={handleInputChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              className={commonInputClasses}
              value={formData.email}
              onChange={handleInputChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              className={commonInputClasses}
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength={8}
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className={commonInputClasses}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />

            <input
              type="tel"
              name="phNumber"
              placeholder="Phone Number"
              className={commonInputClasses}
              value={formData.phNumber}
              onChange={handleInputChange}
              required
              pattern="\d{10}"
            />

            <select
              name="gender"
              className={commonInputClasses}
              value={formData.gender}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
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
                  <option value="">Select Blood Group</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                    (group) => (
                      <option
                        key={group}
                        value={group}
                        className="text-gray-800"
                      >
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
                  min="0"
                  step="0.1"
                />

                <input
                  type="number"
                  name="weight"
                  placeholder="Weight (kg)"
                  className={commonInputClasses}
                  value={formData.weight}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.1"
                />

                <div className="md:col-span-2">
                  <textarea
                    name="diseases"
                    placeholder="Diseases (comma separated)"
                    className={commonInputClasses}
                    value={formData.diseases}
                    onChange={handleInputChange}
                    rows="2"
                  />
                </div>

                <div className="md:col-span-2">
                  <textarea
                    name="familyDiseases"
                    placeholder="Family Diseases (comma separated)"
                    className={commonInputClasses}
                    value={formData.familyDiseases}
                    onChange={handleInputChange}
                    rows="2"
                  />
                </div>

                <div className="md:col-span-2">
                  <textarea
                    name="allergies"
                    placeholder="Allergies (comma separated)"
                    className={commonInputClasses}
                    value={formData.allergies}
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
                  min="0"
                />

                <input
                  type="number"
                  name="consultationFee"
                  placeholder="Consultation Fee"
                  className={commonInputClasses}
                  value={formData.consultationFee}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
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
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gray-900 hover:bg-gray-800"
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