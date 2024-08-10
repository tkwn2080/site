import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SubstrateDesignerPage from './pages/SubstrateDesignerPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/substrate-designer" element={<SubstrateDesignerPage />} />
      </Routes>
    </Router>
  );
}

export default App;