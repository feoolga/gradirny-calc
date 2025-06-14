import { calculateGA, calcGx, calcGg, calcFanPerformance } from '../calculations'; // Добавили calcFanPerformance

describe('Градирни: расчет расхода воздуха (GA)', () => {
  test('Возвращает базовый расход, если t1 === t2', () => {
    expect(calculateGA(25, 1000, 30, 30)).toBe(1000);
  });

  test('Корректно рассчитывает для t между t1 и t2', () => {
    expect(calculateGA(25, 1000, 20, 30)).toBeCloseTo(975); // 1000 * (1 - 0.05*0.5) = 975
  });

  test('Возвращает меньшее значение при более высокой температуре', () => {
    const gaAtLowTemp = calculateGA(20, 1000, 20, 30);
    const gaAtHighTemp = calculateGA(30, 1000, 20, 30);
    expect(gaAtHighTemp).toBeLessThan(gaAtLowTemp);
  });
});

describe('Градирни:Производительность вентиляторной установки', () => {
  test('Рассчитывает производительность вентилятора при стандартных параметрах', () => {
    // Входные данные:
    // const gj = 500;    // Расход воды через секцию [м³/ч]
    // const lambda = 1.8; // Соотношение воздух/вода
    // const density = 1000; // Плотность воды [кг/м³]

    // Ожидаемый результат: gj * lambda * (PHYSICS.WATER_DENSITY / density)
    // Если PHYSICS.WATER_DENSITY = 1000, то: 500 * 1.8 * (1000 / 1000) = 900
    expect(calcFanPerformance(500, 1.8, 1000)).toBeCloseTo(900);
  });
});