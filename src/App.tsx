import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/home';
import Exhibition from './pages/exhibition';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Link to="/">Home</Link>
        <Link to="/exhibition">exhibition 1</Link>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/exhibition" element={<Exhibition />} />
          {/* <Route path="/museum/:artwork_id" element={<Artwork />} /> */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;

