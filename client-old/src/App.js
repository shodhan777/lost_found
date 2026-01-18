import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import FoundForm from './components/FoundForm';
import LostForm from './components/LostForm';
import MatchedResults from './components/MatchResults';
import ClaimItem from './components/ClaimItem';
import AdminDashboard from './components/AdminDashboard'; // Import AdminDashboard

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} /> {/* Admin Route */}
        <Route path="/found" element={<FoundForm />} />
        <Route path="/lost" element={<LostForm />} />
        <Route path="/matches" element={<MatchedResults />} />
        <Route path="/claim/:id" element={<ClaimItem />} />
      </Routes>
    </Router>
  );
}

export default App;

