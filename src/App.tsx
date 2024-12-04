import React from 'react';
import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/home';

function App() {
  return (
    <div>
      <Link to="/">Home</Link>
    </div>
  );
}

export default App;
