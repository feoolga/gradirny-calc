import React from 'react';
import { CalculationForm } from './components/CalculationForm';
import { ResultsPage } from './components/ResultsPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div className="vw-100" style={{ backgroundColor: '#009999' }}>
      <BrowserRouter basename="/gradirny-calc">
        <Routes>
          <Route path="/" element={<CalculationForm />} />
          <Route path="/results-page" element={<ResultsPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;