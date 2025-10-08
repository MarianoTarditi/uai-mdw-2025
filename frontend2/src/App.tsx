import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css"
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Header from "./components/Header";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <>
      <Router>
          <Header/>
          <Routes>
            <Route path="/home" element={<Home/>}></Route>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/signup" element={<SignUp/>}></Route>
          </Routes>
      </Router>
      <ToastContainer/>
    </>
  );
}

export default App;
