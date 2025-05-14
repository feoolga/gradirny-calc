import { useLocation } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const ResultsPage = () => {
  const location = useLocation();
  const results = location.state?.results || {};

  const chartData = results.chartData || [];
  // const hasValidChartData = chartData && chartData.length > 0;

  // Стили для текста
  const textStyles = {
    whiteText: {
      color: 'white',
      fontWeight: 'bold'
    },
    blueText: {
      color: '#1a237e', // Темно-синий
      fontWeight: 'normal'
    },
    axisLabel: {
      fill: 'white', // Белый цвет для подписей осей
      fontSize: 12
    },
    axisTick: {
      fill: 'white' // Белый цвет для значений на осях
    }
  };
  
  // Группировка параметров с русскими ключами
  const parameterGroups = {
    performance: {
      title: 'Основные параметры',
      items: [
        { key: 'Производительность градирни', label: 'Производительность градирни' },
        { key: 'Производительность секции', label: 'Производительность секции' },
        { key: 'Плотность орошения', label: 'Плотность орошения' },
        { key: 'Мощность теплосъема', label: 'Мощность теплосъема' },
      ]
    },
    waterLoss: {
      title: 'Потери воды',
      items: [
        { key: 'Потери на испарение', label: 'Испарение' },
        { key: 'Капельный унос', label: 'Капельный унос' },
        { key: 'Потери на продувку', label: 'Продувка' },
        { key: 'Макс. расход подпиточной воды', label: 'Максимальный расход' },
      ]
    },
    fan: {
      title: 'Вентиляторная система',
      items: [
        { key: 'Статический напор', label: 'Статический напор' },
        { key: 'Динамический напор', label: 'Динамический напор' },
        { key: 'Полный напор', label: 'Полный напор' },
        { key: 'Скорость воздуха в градирне', label: 'Скорость воздуха в градирне' },
        { key: 'Скорость воздуха в вентиляторе', label: 'Скорость воздуха в вентиляторе' },
        { key: 'Потребляемая мощность', label: 'Потребляемая мощность привода' },
      ]
    },
    temperatures: {
      title: 'Температурные параметры',
      items: [
        { key: 'Средняя температура воды', label: 'Средняя температура воды' },
        { key: 'Температура по влажному термометру', label: 'Температура по влажному термометру' },
      ]
    }
  };

  // Фильтруем группы с данными
  const nonEmptyGroups = Object.entries(parameterGroups)
    .filter(([_, group]) => 
      group.items.some(item => results[item.key] !== undefined)
    );

    return (
      <div className="container mt-4">
        <h2 className="mb-4 text-center">Результаты расчёта градирни</h2>
        
        {Object.keys(results).length === 0 ? (
          <div className="alert alert-danger">Нет данных для отображения</div>
        ) : (
          <>
        <div className="row">
          {nonEmptyGroups.map(([groupKey, group]) => (
            <div key={groupKey} className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">{group.title}</h5>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    {group.items.map(item => (
                      <li key={item.key} className="list-group-item d-flex justify-content-between align-items-center">
                        <span>{item.label}</span>
                        <span className="badge bg-dark rounded-pill">
                          {results[item.key]}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* График */}
        {chartData.length > 0 && (
            <div className="mt-5">
              <h4 className="mb-3" >
                График зависимости расхода воздуха и давления
              </h4>
              <div style={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#b0bec5" />
                    <XAxis 
                      dataKey="x" 
                      label={{ 
                        value: 'Параметр X', 
                        position: 'insideBottomRight', 
                        offset: -5,
                        style: textStyles.axisLabel
                      }} 
                      tick={{ fill: '#1a237e' }}
                    />
                    <YAxis 
                      yAxisId="left" 
                      label={{ 
                        value: 'G_A (м³/ч)', 
                        angle: -90, 
                        position: 'insideLeft',
                        style: textStyles.axisLabel
                      }} 
                      tick={{ fill: '#1a237e' }}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      label={{ 
                        value: 'Pst (Па)', 
                        angle: -90, 
                        position: 'insideRight',
                        style: textStyles.axisLabel
                      }} 
                      tick={{ fill: '#1a237e' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1a237e',
                        borderColor: '#1a237e'
                      }}
                      itemStyle={textStyles.whiteText}
                      labelStyle={textStyles.whiteText}
                    />
                    <Legend 
                      wrapperStyle={textStyles.blueText}
                    />
                    <Line 
                      yAxisId="left" 
                      dataKey="ga" 
                      stroke="#FFE4B5"  // Оранжевый
                      name="Расход воздуха (G_A)" 
                      dot={{ r: 4, fill: '#1a237e' }} 
                    />
                    <Line 
                      yAxisId="right" 
                      dataKey="pst" 
                      stroke="#7FFFD4"  // Зеленый
                      name="Статическое давление (Pst)" 
                      dot={{ r: 4, fill: '#1a237e' }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};