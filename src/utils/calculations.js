import { PHYSICS, DEFAULTS } from './constants';

/**
 * Расчёт плотности орошения (qж)
 * @param {number} g1 - Производительность градирни (м³/ч)
 * @param {number} [area=DEFAULTS.TOWER_AREA] - Площадь орошения (м²)
 * @returns {number} Плотность орошения (м³/(м²·ч))
 * @throws {Error} Если площадь орошения ≤ 0
 */
export const calcGx = (g1, area = DEFAULTS.TOWER_AREA) => {
  if (!g1 || g1 <= 0) return 0;
  if (area <= 0) throw new Error("Площадь орошения должна быть > 0");
  return g1 / area;
};

/**
 * Расчёт производительности одной секции (Gж)
 * @param {number} g1 - Производительность градирни (м³/ч)
 * @param {number} n - Количество секций
 * @returns {number} Производительность секции (м³/ч)
 * @throws {Error} Если количество секций ≤ 0
 */
export const calcGg = (g1, n) => {
  if (!g1 || g1 <= 0) return 0;
  if (n <= 0) throw new Error("Количество секций должно быть > 0");
  return g1 / n;
};

/**
 * Расчёт тепловой мощности (Q)
 * @param {number} g1 - Производительность градирни (м³/ч)
 * @param {number} t1 - Температура входящей воды (°C)
 * @param {number} t2 - Температура охлаждённой воды (°C)
 * @returns {number} Тепловая мощность (МВт)
 * @throws {Error} Если t1 ≤ t2
 */
export const calcQ = (g1, t1, t2) => {
  if (!g1 || g1 <= 0) return 0;
  if (t1 == null || t2 == null) return 0;
  if (t1 <= t2) throw new Error("t1 должна быть > t2");
  return (g1 * PHYSICS.WATER_HEAT_CAPACITY * (t1 - t2)) / 3600;
};

/**
 * Расчёт капельного уноса (Gy)
 * @param {number} g1 - Производительность градирни (м³/ч)
 * @returns {number} Капельный унос (м³/ч)
 */
export const calcGy = (g1) => {
  if (!g1 || g1 <= 0) return 0;
  return g1 * DEFAULTS.DROPLET_LOSS_COEFF;
};

/**
 * Расчёт потерь на испарение (Gi)
 * @param {number} gg - Производительность секции (м³/ч)
 * @param {number} t1 - Температура входящей воды (°C)
 * @param {number} t2 - Температура охлаждённой воды (°C)
 * @returns {number} Потери на испарение (м³/ч)
 */
export const calcGi = (gg, t1, t2) => {
  if (!gg || gg <= 0) return 0;
  if (t1 == null || t2 == null || t1 <= t2) return 0;
  return (gg * PHYSICS.WATER_HEAT_CAPACITY * (t1 - t2)) / PHYSICS.EVAPORATION_HEAT;
};

/**
 * Расчёт соотношения воздух/вода (λ)
 * @param {number} g1 - Производительность градирни (м³/ч)
 * @param {number} n - Количество секций
 * @returns {number} Безразмерное соотношение
 */
export const calcLambda = (g1, n) => {
  if (!g1 || g1 <= 0 || !n || n <= 0) return 0;
  return 1100000 / (g1 / n);
};

/**
 * Расчет температуры по влажному термометру
 * (упрощенная формула, может быть заменена на более точную)
 */
export const calcWetBulbTemp = (dryTemp, humidity) => {
  return dryTemp - (100 - humidity) / 5;
};

/**
 * Основная функция расчёта всех параметров
 * @param {Object} values - Входные параметры
 * @param {Object} values.initialData - { g1, n, t1, t2 }
 * @param {Object} values.airParameters - { humidity, temperature_dry, barometric_press }
 * @param {Object} values.towerParameters - { width, length }
 * @returns {Object} Результаты в формате { "Параметр": "значение с единицами" }
 * @throws {Error} При некорректных входных данных
 */
export const getCalculationResults = (values) => {
  if (!values) throw new Error("Отсутствуют входные данные");
  
  try {
    const { g1, n, t1, t2 } = values.initialData || {};
    const { humidity, temperature_dry, barometric_press } = values.airParameters || {};
    const { width, length } = values.towerParameters || {};
    
    const area = width * length;
    const gg = calcGg(g1, n);
    
    return {
      "Производительность градирни": `${g1 || 0} м³/ч`,
      "Производительность секции": `${gg.toFixed(2)} м³/ч`,
      "Плотность орошения": `${calcGx(g1, area).toFixed(2)} м³/(м²·ч)`,
      "Мощность теплосъема": `${calcQ(g1, t1, t2).toFixed(4)} МВт`,
      "Соотношение воздух/вода": `${calcLambda(g1, n).toFixed(2)}`,
      "Потери на испарение": `${calcGi(gg, t1, t2).toFixed(2)} м³/ч`,
      "Капельный унос": `${calcGy(g1).toFixed(2)} м³/ч`,
      "Параметры воздуха": `${temperature_dry || 0} °C, ${humidity || 0}%`,
      "Давление": `${barometric_press || 0} кПа`
    };
  } catch (error) {
    console.error("Ошибка расчётов:", error);
    throw new Error(`Расчёт не выполнен: ${error.message}`);
  }
};

export const calculations = {
  calcGx,
  calcGg,
  calcQ,
  calcGy,
  calcGi,
  calcLambda,
  calcWetBulbTemp,
  getCalculationResults
};