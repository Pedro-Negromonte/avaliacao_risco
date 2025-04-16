import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { Assessment } from './pages/Assessment';
import { ClientArea } from './pages/ClientArea';
import { Registration } from './pages/Registration';
import { Payment } from './pages/Payment';
import { Login } from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/cadastro" element={<Registration />} />
        <Route path="/pagamento" element={<Payment />} />
        <Route path="/login" element={<Login />} />
        <Route path="/area-cliente" element={<ClientArea />} />
        <Route path="/assessment" element={<Assessment />} />
      </Routes>
    </Router>
  );
}

export default App;