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
 * Расчёт суммарного коэффициента сопротивления
 * @param {number} zso - Коэф. сопротивления оросителя
 * @param {number} zvu - Коэф. сопротивления водоуловителя
 * @param {number} zok - Коэф. сопротивления окон
 * @param {number} hor - Высота слоя оросителя (м)
 * @param {number} kor - Коэффициент орошения
 * @param {number} qx - Плотность орошения
 * @param {number} L - Длина воздухораспределителя
 * @returns {number} Суммарный коэффициент сопротивления
 */
export const calcTotalResistance = (zso, zvu, zok, hor, kor, qx, L) => {
  return zok + hor * (zso + kor * qx) + 0.1 * L + zvu;
};

/**
 * Расчёт статического напора вентилятора
 * @param {number} wgr - Скорость воздуха в градирне (м/с)
 * @param {number} g1 - Плотность ПВС (кг/м³)
 * @param {number} z - Суммарный коэф. сопротивления
 * @returns {number} Статический напор (Па)
 */
export const calcStaticPressure = (wgr, g1, z) => {
  return (Math.pow(wgr, 2) * g1 * z / 2);
};

/**
 * Расчёт динамического напора вентилятора
 * @param {number} wven - Скорость воздуха в корпусе вентилятора (м/с)
 * @param {number} g1 - Плотность ПВС (кг/м³)
 * @returns {number} Динамический напор (Па)
 */
export const calcDynamicPressure = (wven, g1) => {
  return (Math.pow(wven, 2) * g1) / 2;
};

/**
 * Расчёт полного напора вентилятора
 * @param {number} pStatic - Статический напор (Па)
 * @param {number} pDynamic - Динамический напор (Па)
 * @returns {number} Полный напор (Па)
 */
export const calcTotalPressure = (pStatic, pDynamic) => {
  return pStatic + pDynamic;
};

/**
 * Расчёт производительности вентиляторной установки
 * @param {number} gj - Производительность секции (м³/ч)
 * @param {number} lambda - Относительный расход
 * @param {number} g1 - Плотность ПВС (кг/м³)
 * @returns {number} Производительность (м³/ч)
 */
export const calcFanPerformance = (gj, lambda, g1) => {
  return gj * lambda * (PHYSICS.WATER_DENSITY / g1);
};

/**
 * Расчёт потребляемой мощности
 * @param {number} gv - Производительность вентустановки (м³/ч)
 * @param {number} pTotal - Полный напор (Па)
 * @param {number} g1 - Плотность ПВС (кг/м³)
 * @param {number} etaK - КПД рабочего колеса
 * @param {number} tAvg - Средняя температура (°C)
 * @returns {number} Потребляемая мощность (кВт)
 */
export const calcPowerConsumption = (gv, pTotal, g1, etaK, tAvg) => {
  return (gv * pTotal) / (1.3 * Math.pow(10, 4) * g1 * etaK * (tAvg + 273));
};

/**
 * Расчёт минимальной мощности привода
 * @param {number} n0 - Потребляемая мощность (кВт)
 * @param {number} etaP - КПД привода
 * @returns {number} Минимальная мощность (кВт)
 */
export const calcMinDrivePower = (n0, etaP) => {
  return n0 / etaP;
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
    const { width, length, fanDiameter, windowHeight } = values.towerParameters || {};
    const { a0, m, kor, hor } = values.sprinklerCharacteristics || {};
    const { zso, zvu, zok } = values.resistanceCoefficients || {};
    const { etaK, etaP } = values.efficiency || {};
    
    // Основные расчеты
    const area = width * length;
    const gg = calcGg(g1, n);
    const qx = calcGx(g1, area);
    const L = width / 4;
    const tAvg = (t1 + t2) / 2;

    // Расчет потерь воды
    const gi = calcGi(gg, t1, t2); // Потери на испарение
    const gy = calcGy(g1); // Капельный унос
    const gp = (gi / 4 - gy).toFixed(2); // Потери на продувку
    const gd = (parseFloat(gi) + parseFloat(gy) + parseFloat(gp)).toFixed(2); // Макс. расход подпиточной воды
    
    // Расчеты для вентиляторной установки
    const zTotal = calcTotalResistance(zso, zvu, zok, hor, kor, qx, L);
    const lambda = calcLambda(g1, n);
    const gv = calcFanPerformance(gg, lambda, PHYSICS.WATER_DENSITY);
    const wgr = gv / (3600 * area);
    const wven = gv / (Math.PI * Math.pow(fanDiameter/2, 2) * 3600);
    
    const pStatic = calcStaticPressure(wgr, PHYSICS.WATER_DENSITY, zTotal);
    const pDynamic = calcDynamicPressure(wven, PHYSICS.WATER_DENSITY);
    const pTotal = calcTotalPressure(pStatic, pDynamic);
    const n0 = calcPowerConsumption(gv, pTotal, PHYSICS.WATER_DENSITY, etaK, tAvg);
    const nMin = calcMinDrivePower(n0, etaP);
    
    return {
      // Основные параметры
      "Производительность градирни": `${g1 || 0} м³/ч`,
      "Производительность секции": `${gg.toFixed(2)} м³/ч`,
      "Плотность орошения": `${qx.toFixed(2)} м³/(м²·ч)`,
      "Мощность теплосъема": `${calcQ(g1, t1, t2).toFixed(4)} МВт`,
      "Соотношение воздух/вода": `${lambda.toFixed(2)}`,
      "Потери на испарение": `${gi.toFixed(2)} м³/ч`,
      "Капельный унос": `${gy.toFixed(2)} м³/ч`,
      "Потери на продувку": `${gp} м³/ч`,
      "Макс. расход подпиточной воды": `${gd} м³/ч`,
      
      // Параметры градирни
      "Площадь орошения": `${area.toFixed(2)} м²`,
      "Длина воздухораспределителя": `${L.toFixed(2)} м`,
      "Площадь окон": `${(length * n * windowHeight).toFixed(2)} м²`,
      
      // Вентиляторная установка
      "Суммарное сопротивление": `${zTotal.toFixed(2)}`,
      "Производительность вентилятора": `${gv.toFixed(2)} м³/ч`,
      "Скорость воздуха в градирне": `${wgr.toFixed(2)} м/с`,
      "Скорость воздуха в вентиляторе": `${wven.toFixed(2)} м/с`,
      "Статический напор": `${pStatic.toFixed(2)} Па`,
      "Динамический напор": `${pDynamic.toFixed(2)} Па`,
      "Полный напор": `${pTotal.toFixed(2)} Па`,
      "Потребляемая мощность": `${n0.toFixed(2)} кВт`,
      "Минимальная мощность привода": `${nMin.toFixed(2)} кВт`,
      
      // Дополнительные параметры
      "Температура по влажному термометру": `${calcWetBulbTemp(temperature_dry, humidity).toFixed(1)} °C`,
      "Средняя температура воды": `${tAvg.toFixed(1)} °C`
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
  calcTotalResistance,
  calcStaticPressure,
  calcDynamicPressure,
  calcTotalPressure,
  calcFanPerformance,
  calcPowerConsumption,
  calcMinDrivePower,
  getCalculationResults
};