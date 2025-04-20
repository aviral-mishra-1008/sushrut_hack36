import "./App.css";
import { BrowserRouter, Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from './pages/signup';
import Agent from './pages/Agent';
import { ModeratorLogin } from './pages/ModeratorLogin';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { ModeratorDashboard } from './pages/ModeratorDashboard';
import { Navigate } from 'react-router-dom';
import { ProtectedRoute2 } from './routes/ProtectedRoute2';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import SignUpDA from "./pages/SignupDA";
import LoginDA from "./pages/LoginDA";
import BookTest from "./pages/BookTest";
function App() {
  return (
    <BrowserRouter>
    <div className="App">

      {/* <Navbar/> */}

      <Routes>
        <Route path = "signup" element = { <Signup/>}/> 
        <Route path = "login" element = { <Login/> }/> 
        <Route path = "agent" element = { <Agent/> }/> 
        <Route path = "signupDA" element = { <SignUpDA/> }/>
        <Route path = "touchless" element = { <LoginDA/> }/>
        <Route path="/patient/booktest" element={<BookTest />} />

        {/* Redirect /moderator to /moderator/dashboard */}
        <Route 
          path="/moderator" 
          element={<Navigate to="/moderator/dashboard" replace />} 
        />

        {/* Login route */}
        {/* <Route 
          path="/moderator/login" 
          element={<ModeratorLogin />} 
        /> */}

        {/* Protected dashboard route */}
        {/* <Route
          path="/moderator/dashboard"
          element={
            // <ProtectedRoute>
              <ModeratorDashboard />
            // </ProtectedRoute>
          }
        /> */}
        
         {/* Protected Patient Routes */}
         <Route
          path="/patient/dashboard"
          element={
            <ProtectedRoute2 allowedRole="patient">
              <PatientDashboard />
            </ProtectedRoute2>
          }
        />

        {/* Protected Doctor Routes */}
        <Route
          path="/doctor/dashboard"
          element={
            <ProtectedRoute2 allowedRole="doctor">
              <DoctorDashboard />
            </ProtectedRoute2>
          }
        />
                <Route path="/moderator/login" element={<ModeratorLogin />} />
                <Route path="/moderator/dashboard" element={<ModeratorDashboard />} />

      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
