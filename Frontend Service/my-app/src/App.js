import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/signup';
import Navbar from './components/Navbar';
import Agent from './pages/Agent';
import { ModeratorLogin } from './pages/ModeratorLogin';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { ModeratorDashboard } from './pages/ModeratorDashboard';
import { Navigate } from 'react-router-dom';
function App() {
  return (
    <BrowserRouter>
    <div className="App">

      {/* <Navbar/> */}

      <Routes>
        <Route path = "signup" element = { <Signup/>}/> 
        <Route path = "login" element = { <Login/> }/> 
        <Route path = "agent" element = { <Agent/> }/> 

        {/* Redirect /moderator to /moderator/dashboard */}
        <Route 
          path="/moderator" 
          element={<Navigate to="/moderator/dashboard" replace />} 
        />

        {/* Login route */}
        <Route 
          path="/moderator/login" 
          element={<ModeratorLogin />} 
        />

        {/* Protected dashboard route */}
        <Route
          path="/moderator/dashboard"
          element={
            // <ProtectedRoute>
              <ModeratorDashboard />
            // </ProtectedRoute>
          }
        />
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
