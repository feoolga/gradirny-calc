import React from 'react';
import { CalculationForm } from './components/CalculationForm';
import { ResultsTable } from './components/ResultsTable';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div className="vw-100 bg-dark">
      <BrowserRouter basename="/gradirny-calc">
        <Routes>
          <Route path="/" element={<CalculationForm />} />
          <Route path="/results-table" element={<ResultsTable />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;