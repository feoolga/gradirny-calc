import { useLocation } from 'react-router-dom';

export const ResultsTable = () => {
  const location = useLocation();
  const results = location.state?.results || {};
  
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
        <div className="alert alert-danger">
          Нет данных для отображения. Проверьте расчеты.
        </div>
      ) : (
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
      )}
    </div>
  );
};