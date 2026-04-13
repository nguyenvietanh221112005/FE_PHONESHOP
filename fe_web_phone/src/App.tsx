import { Routes, Route } from "react-router-dom";
import Login from "./auth/LoginPage.tsx";
import Home from "./HomePage/HomePage.tsx";
import Register from "./auth/RegisterPage.tsx"
import ForgotPassword from "./auth/ForgotPasswordPage.tsx";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/dashboard" element={<Home />} />

    </Routes>
  );
}

export default App;