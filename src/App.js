import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SubstrateDesigner from './components/SubstrateDesigner';

function App() {
  return (
    <Router basename="/">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/substrate-designer" element={<SubstrateDesigner />} />
      </Routes>
    </Router>
  );
}

export default App;