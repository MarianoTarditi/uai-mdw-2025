import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import { Login } from "./pages/auth/login/Login";
import { ForgotPassword } from "./pages/auth/forgotPassword/ForgotPassword";
import { Header } from "./components/header/Header";
import { AuthHeader } from "./components/header/AuthHeader"; // Nuevo header para Auth
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SignUp } from "./pages/auth/signUp/SignUp";

function AppContent() {
  const location = useLocation();

  // Si estamos en rutas de autenticación, usamos AuthHeader
  const isAuthRoute =
    location.pathname === "/login" || location.pathname === "/signUp" || location.pathname === "/forgotPassword";

  return (
    <>
      {isAuthRoute ? <AuthHeader /> : <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
      <ToastContainer />
    </Router>
  );
}

export default App;
