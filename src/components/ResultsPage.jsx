import { useLocation } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useFormik } from 'formik';
import { CalculationForInitialDataSection } from "./CalculationForInitialDataSection";
import { CalculationForTowerParametersSection } from "./CalculationForTowerParametersSection";
import { CalculationForParametersOutdoorAirSection } from "./CalculationForParametersOutdoorAirSection";
import { FanSystemResultsSection } from "./FanSystemResultsSection";

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
      <div className="container">
        <h2 className="mb-4 text-center">Результаты расчёта градирни</h2>
        
        {Object.keys(results).length === 0 ? (
          <div className="alert alert-danger">Нет данных для отображения</div>
        ) : (
          <>

        <div className="row">
          <div className="col">
            <CalculationForInitialDataSection 
              results={results.performance} 
            />
          </div>
          <div className="col">
            <CalculationForTowerParametersSection 
              results={{
                geometry: results.geometry,
                sprinkler: results.sprinkler
              }} 
            />
          </div>
        </div>

        <div className="row">
          <div className="col">
            <CalculationForParametersOutdoorAirSection  
              results={results.temperatures} 
            />
          </div>
          <div className="col">
            <FanSystemResultsSection 
              results={results.fanSystem} 
            />
          </div>
        </div>

        {/* График */}
        {results.charts?.["График зависимости"]?.length > 0 && (
  <div className="bg-white p-3 rounded shadow-sm"> {/* Белый фон контейнера */}
    <h4 className="mb-3 text-dark"> {/* Тёмный текст заголовка */}
      График зависимости расхода воздуха и давления
    </h4>
    <div style={{ height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={results.charts["График зависимости"]}
          margin={{ top: 20, right: 30, left: 40, bottom: 30 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#e0e0e0"
            strokeOpacity={0.7}
          />
          
          <XAxis 
            dataKey="x"
            label={{ 
              value: 'Температура (°C)', 
              position: 'insideBottomRight',
              offset: -5,
              style: { fill: '#424242', fontSize: 12 }
            }}
            tick={{ fill: '#424242', fontSize: 12 }}
            axisLine={{ stroke: '#424242' }}
          />
          
          <YAxis 
            yAxisId="left"
            label={{
              value: 'Расход воздуха (м³/ч)',
              angle: -90,
              position: 'insideLeft',
              style: { fill: '#424242', fontSize: 12 }
            }}
            tick={{ fill: '#424242', fontSize: 12 }}
            axisLine={{ stroke: '#424242' }}
          />
          
          <YAxis 
            yAxisId="right"
            orientation="right"
            label={{
              value: 'Давление (Па)',
              angle: -90,
              position: 'insideRight',
              style: { fill: '#424242', fontSize: 12 }
            }}
            tick={{ fill: '#424242', fontSize: 12 }}
            axisLine={{ stroke: '#424242' }}
          />
          
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              borderColor: '#e0e0e0',
              color: '#424242',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            formatter={(value, name) => [
              `${value} ${name.includes('Расход') ? 'м³/ч' : 'Па'}`,
              name
            ]}
            labelFormatter={(label) => `Температура: ${label} °C`}
          />
          
          <Legend 
            wrapperStyle={{ color: '#424242' }}
          />
          
          <Line
            yAxisId="left"
            dataKey="ga"
            name="Расход воздуха"
            stroke="#1976d2"
            dot={false}
            strokeWidth={2}
            type="monotone"  // Плавная кривая
            activeDot={{ r: 6, fill: '#1976d2' }}
          />
          
          <Line
            yAxisId="right"
            dataKey="pst"
            name="Статическое давление"
            stroke="#d32f2f"
            dot={false}
            strokeWidth={2}
            type="monotone"  // Плавная кривая
            activeDot={{ r: 6, fill: '#d32f2f' }}
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