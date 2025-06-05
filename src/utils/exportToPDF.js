import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; // Явный импорт функции
import RobotoRegular from './Roboto-Regular-my-normal.js';

// Вспомогательная функция для заголовков
const getSectionTitle = (section) => {
  const titles = {
    performance: 'Основные параметры',
    waterLoss: 'Потери воды',
    geometry: 'Геометрические параметры',
    fanSystem: 'Вентиляторная система',
    temperatures: 'Температурные параметры',
    sprinkler: 'Характеристики оросителя',
    meta: 'Дополнительная информация'
  };
  return titles[section] || section;
};

export const exportToPDF = async (results, fileName = "градирня_расчет", setLoading) => {
  try {
    setLoading?.(true);
    
    // 1. Инициализация PDF
    const pdf = new jsPDF();
    
    // 2. Регистрация шрифта
    pdf.addFileToVFS('Roboto-Regular.ttf', RobotoRegular);
    pdf.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
    pdf.setFont('Roboto');

    // 3. Добавление заголовка
    pdf.setFontSize(16);
    pdf.text('Результаты расчёта градирни', 105, 15, { align: 'center' });

    let yPosition = 25;
    const pageWidth = pdf.internal.pageSize.getWidth() - 30;

    // 4. Генерация таблиц через autoTable
    for (const section in results) {
      if (section === 'charts') continue;
      if (!results[section]) continue;

      // Добавляем раздел
      pdf.setFontSize(14);
      pdf.text(getSectionTitle(section), 15, yPosition);
      yPosition += 10;

      // Явный вызов autoTable как функции
      autoTable(pdf, {
        startY: yPosition,
        head: [['Параметр', 'Значение']],
        body: Object.entries(results[section]).map(([key, value]) => [key, String(value)]),
        styles: {
          font: 'Roboto',
          fontSize: 10,
          cellPadding: 3
        },
        headStyles: {
          fillColor: [64, 159, 50],
          textColor: 255,
          font: 'Roboto',         // Явно указываем шрифт
          fontStyle: 'normal',
          halign: 'center'
        },
        columnStyles: {
          0: { cellWidth: pageWidth * 0.6 },
          1: { cellWidth: pageWidth * 0.4 }
        }
      });

      yPosition = pdf.lastAutoTable.finalY + 10;
    }

    // 5. Обработка графика
    if (results.charts?.["График зависимости"]?.length > 0) {
      pdf.setFontSize(14);
      pdf.text('График зависимости', 15, yPosition);
      yPosition += 10;

      const tableData = results.charts["График зависимости"]
        .filter((_, i) => i % 5 === 0)
        .map(point => [
          point.x.toFixed(1),
          point.ga.toFixed(2),
          point.pst.toFixed(2)
        ]);

      autoTable(pdf, {
        startY: yPosition,
        head: [['Температура (°C)', 'Расход воздуха (м³/ч)', 'Давление (Па)']],
        body: tableData,
        styles: {
          font: 'Roboto',
          fontSize: 8,
          cellPadding: 2
        },
        headStyles: {
          fillColor: [64, 159, 50],
          font: 'Roboto',         // Явно указываем шрифт
          fontStyle: 'normal',
          textColor: 255
        },
        columnStyles: {
          0: { cellWidth: pageWidth / 3 },
          1: { cellWidth: pageWidth / 3 },
          2: { cellWidth: pageWidth / 3 }
        }
      });
    }

    pdf.save(`${fileName}.pdf`);

  } catch (error) {
    console.error('Ошибка при генерации PDF:', error);
    throw error;
  } finally {
    setLoading?.(false);
  }
};