import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Home from "./components/Home";
import CallbackPage from "./components/CallbackPage";
import Survey from "./components/survey";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/home" element={<Home />} />
      <Route path="/survey" element={<Survey />} />
      <Route path="/callback" element={<CallbackPage />} />
    </Routes>
  );
}

export default App;
