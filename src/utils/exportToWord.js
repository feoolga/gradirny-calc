import { Document, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, Packer } from 'docx';

export const exportToWord = async (results, fileName = "градирня_расчет") => {
  try {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: "Результаты расчёта градирни",
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 400 }
          }),
          ...generateWordContent(results)
        ]
      }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${fileName}.docx`);
  } catch (error) {
    console.error('Ошибка при генерации Word:', error);
    throw error;
  }
};

const generateWordContent = (results) => {
  const content = [];
  
  // Основные разделы (исключая charts)
  for (const section in results) {
    if (section === 'charts') continue;
    if (!results[section] || Object.keys(results[section]).length === 0) continue;
    
    // Добавляем заголовок раздела
    content.push(
      new Paragraph({
        text: getSectionTitle(section),
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 200 }
      })
    );
    
    // Создаем таблицу для параметров
    const tableRows = Object.entries(results[section]).map(([key, value]) => 
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph(key)],
            width: { size: 3500, type: 'dxa' }
          }),
          new TableCell({
            children: [new Paragraph(value.toString())],
            width: { size: 2500, type: 'dxa' }
          })
        ]
      })
    );
    
    // Добавляем таблицу в контент
    content.push(
      new Table({
        rows: tableRows,
        width: { size: 100, type: 'pct' },
        margins: { top: 100, bottom: 100, left: 100, right: 100 }
      })
    );
    
    // Добавляем отступ после таблицы
    content.push(new Paragraph({ text: '', spacing: { after: 300 } }));
  }

  // Обработка графика
  if (results.charts?.["График зависимости"]?.length > 0) {
    content.push(
      new Paragraph({
        text: "График зависимости",
        heading: HeadingLevel.HEADING_2,
        pageBreakBefore: true,
        spacing: { after: 200 }
      })
    );
    
    // Создаем таблицу с данными графика
    const chartData = results.charts["График зависимости"]
      .filter((_, index) => index % 5 === 0); // Берем каждую 5-ю точку
    
    const chartTableRows = [
      // Заголовки таблицы
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Температура (°C)")], width: { size: 2000 } }),
          new TableCell({ children: [new Paragraph("Расход воздуха (м³/ч)")], width: { size: 2000 } }),
          new TableCell({ children: [new Paragraph("Давление (Па)")], width: { size: 2000 } })
        ],
        tableHeader: true
      }),
      // Данные графика
      ...chartData.map(point => 
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph(point.x.toFixed(1))] }),
            new TableCell({ children: [new Paragraph(point.ga.toFixed(2))] }),
            new TableCell({ children: [new Paragraph(point.pst.toFixed(2))] })
          ]
        })
      )
    ];
    
    content.push(
      new Table({
        rows: chartTableRows,
        width: { size: 100, type: 'pct' },
        margins: { top: 100, bottom: 100, left: 100, right: 100 }
      })
    );
    
    // Добавляем описание
    content.push(
      new Paragraph({
        text: "Данные графика зависимости расхода воздуха и давления от температуры воды",
        italics: true,
        spacing: { before: 200, after: 400 }
      })
    );
  }
  
  return content;
};

// Функция для сохранения файла
const saveAs = (blob, fileName) => {
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
};

// Та же функция для заголовков, что и в PDF
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