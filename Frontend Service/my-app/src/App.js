import "./App.css";
import { BrowserRouter, Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import Login from "./pages/Login";

function App() {
  return(
     <div className="App">
         <BrowserRouter>
          <Routes>
         <Route path="login" element={<Login />} />
        </Routes>
      </BrowserRouter>
     </div>
  )
  
}

export default App;
