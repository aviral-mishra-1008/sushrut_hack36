import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/signup';
import Navbar from './components/Navbar';
import Agent from './pages/Agent';

function App() {
  return (
    <BrowserRouter>
    <div className="App">

      {/* <Navbar/> */}

      <Routes>
        <Route path = "signup" element = { <Signup/>}/> 
        <Route path = "login" element = { <Login/> }/> 
        <Route path = "agent" element = { <Agent/> }/> 
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
