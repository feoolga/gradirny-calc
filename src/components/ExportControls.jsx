import React, { useState } from 'react';
import { Button, ButtonGroup, Spinner, Modal } from 'react-bootstrap';
import { exportToPDF } from '../utils/exportToPDF';
import { exportToWord } from '../utils/exportToWord';
import { useNavigate } from 'react-router-dom'; // Добавляем хук для навигации

const ExportControls = ({ results, fileName = "градирня_расчет" }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Хук для перехода между страницами
  
  const handleExportPDF = async () => {
    try {
      setLoading(true);
      await exportToPDF(results, fileName, setLoading);
    } catch (error) {
      console.error('Export error:', error);
      setLoading(false);
    }
  };

  const handleExportWord = () => {
    exportToWord(results, fileName);
  };

  const handleGoHome = () => {
    navigate('/'); // Переход на главную страницу
  };

  return (
    <>
      <ButtonGroup className="mb-4">
        <Button 
          variant="outline-primary" 
          onClick={handleExportPDF}
          className="custom-outline-primary"
          disabled={loading}
        >
            'Экспорт в PDF'
        </Button>
        
        <Button
          variant="outline-success"
          onClick={handleExportWord}
          className="custom-outline-success"
          disabled={loading}
        >
          Экспорт в Word
        </Button>
        
        {/* Новая кнопка "На главную" */}
        <Button
          variant="outline-secondary"
          onClick={handleGoHome}
          className="custom-outline-secondary"
        >
          На главную
        </Button>
      </ButtonGroup>

    </>
  );
};

export default ExportControls;