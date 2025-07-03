import { PHYSICS, DEFAULTS } from './constants';

/**
 * Модуль расчётов для градирен ВОДЭХ-144
 * Все формулы и константы взяты из технической документации ВОДЭХ-144
 * и соответствуют стандартным теплотехническим расчетам градирен
 */

// ==================== Вспомогательные функции для графика ====================

/**
 * Расчёт расхода воздуха (GA) для графика в зависимости от температуры
 * Формула основана на линейной аппроксимации изменения расхода при изменении температуры
 * @param {number} t - Текущая температура [°C]
 * @param {number} baseGA - Базовый расход воздуха [м³/ч]
 * @param {number} t1 - Начальная температура воды [°C]
 * @param {number} t2 - Конечная температура воды [°C]
 * @returns {number} Расход воздуха при температуре t [м³/ч]
 */
export const calculateGA = (t, baseGA, t1, t2) => {
  if (t1 === t2) return baseGA;
  const tempRatio = (t - t1) / (t2 - t1);
  return baseGA * (1 - 0.05 * tempRatio); // 5% изменение расхода на градус
};

/**
 * Расчёт статического давления (Pst) для графика
 * Формула учитывает изменение плотности воздуха при изменении температуры
 * @param {number} t - Текущая температура [°C]
 * @param {number} basePst - Базовое статическое давление [Па]
 * @param {number} t1 - Начальная температура воды [°C]
 * @param {number} t2 - Конечная температура воды [°C]
 * @returns {number} Статическое давление при температуре t [Па]
 */
const calculatePst = (t, basePst, t1, t2) => {
  if (t1 === t2) return basePst;
  const tempRatio = (t - t1) / (t2 - t1);
  return basePst * (1 - 0.03 * tempRatio); // 3% изменение давления на градус
};

/**
 * Генерация данных для графика зависимости расхода воздуха и давления от температуры
 * @param {number} g1 - Расход воды [м³/ч]
 * @param {number} t1 - Начальная температура воды [°C]
 * @param {number} t2 - Конечная температура воды [°C]
 * @param {number} basePst - Базовое статическое давление [Па]
 * @returns {Array<{x: number, ga: number, pst: number}>} Массив точек для графика
 */
const generateChartData = (g1, t1, t2, basePst) => {
  const data = [];
  const tempStep = 0.2; // Шаг температуры для построения графика
  const startTemp = Math.min(t1, t2);
  const endTemp = Math.max(t1, t2);
  
  for (let t = startTemp; t <= endTemp; t += tempStep) {
    data.push({
      x: parseFloat(t.toFixed(2)),
      ga: parseFloat(calculateGA(t, g1, t1, t2).toFixed(2)),
      pst: parseFloat(calculatePst(t, basePst, t1, t2).toFixed(2))
    });
  }
  return data;
};

// ==================== Основные расчётные функции ====================

/**
 * Расчёт плотности орошения [м³/(м²·ч)]
 * Формула: qж = Gгр / fор (из листа ВОДЭХ-144, ячейка C9)
 * @param {number} g1 - Расход воды [м³/ч]
 * @param {number} area - Площадь орошения [м²]
 * @returns {number} Плотность орошения [м³/(м²·ч)]
 * @throws {Error} Если площадь <= 0
 */
export const calcGx = (g1, area = DEFAULTS.TOWER_AREA) => {
  if (!g1 || g1 <= 0) return 0;
  if (area <= 0) throw new Error("Площадь орошения должна быть > 0");
  return g1 / area;
};

/**
 * Расчёт производительности одной секции [м³/ч]
 * Формула: Gж = Gг / n (из листа ВОДЭХ-144, ячейка C6)
 * @param {number} g1 - Общий расход воды [м³/ч]
 * @param {number} n - Количество секций
 * @returns {number} Производительность секции [м³/ч]
 * @throws {Error} Если количество секций <= 0
 */
export const calcGg = (g1, n) => {
  if (!g1 || g1 <= 0) return 0;
  if (n <= 0) throw new Error("Количество секций должно быть > 0");
  return g1 / n;
};

/**
 * Расчёт тепловой мощности [МВт]
 * Формула: Q = Gг * cж * (t1 - t2) / 3600 (из листа ВОДЭХ-144, ячейка C10)
 * где 3600 - перевод часов в секунды
 * @param {number} g1 - Расход воды [м³/ч]
 * @param {number} t1 - Начальная температура [°C]
 * @param {number} t2 - Конечная температура [°C]
 * @returns {number} Тепловая мощность [МВт]
 */
const calcQ = (g1, t1, t2) => {
  if (typeof t1 !== 'number' || typeof t2 !== 'number') return 0;
  if (t1 <= t2) return 0;
  return (g1 * (t1 - t2) * PHYSICS.WATER_HEAT_CAPACITY) / 3600; // Переводим в МВт
};

/**
 * Расчёт капельного уноса воды [м³/ч]
 * Формула: Gy = 0,0004 * Gг (из листа ВОДЭХ-144, ячейка H22)
 * @param {number} g1 - Расход воды [м³/ч]
 * @returns {number} Потери на капельный унос [м³/ч]
 */
const calcGy = (g1) => {
  if (!g1 || g1 <= 0) return 0;
  return g1 * DEFAULTS.DROPLET_LOSS_COEFF; // 0.0004 из документации
};

/**
 * Расчёт потерь на испарение [м³/ч]
 * Формула: Gi = Gг * cж * (t1 - t2) / r (из листа ВОДЭХ-144, ячейка H21)
 * где r = 595 ккал/кг - теплота парообразования
 * @param {number} gg - Производительность секции [м³/ч]
 * @param {number} t1 - Начальная температура [°C]
 * @param {number} t2 - Конечная температура [°C]
 * @returns {number} Потери на испарение [м³/ч]
 */
const calcGi = (gg, t1, t2) => {
  if (!gg || gg <= 0) return 0;
  if (t1 <= t2) return 0;
  return (gg * PHYSICS.WATER_HEAT_CAPACITY * (t1 - t2)) / PHYSICS.EVAPORATION_HEAT;
};

/**
 * Расчёт температуры по влажному термометру [°C]
 * Формула из листа ВОДЭХ-144, ячейка C24 (сложная эмпирическая формула)
 * @param {number} dryTemp - Температура по сухому термометру [°C]
 * @param {number} humidity - Относительная влажность [доли единицы]
 * @returns {number} Температура по влажному термометру [°C]
 */
const calcWetBulbTemp = (dryTemp, humidity) => {
  if (humidity >= 1) return dryTemp;
  // Сложная формула из Excel (использует ATAN и другие тригонометрические функции)
  return dryTemp * (Math.atan(0.151977 * Math.pow(humidity * 100 + 8.313659, 0.5))) + 
         Math.atan(dryTemp + humidity * 100) - 
         Math.atan(humidity * 100 - 1.676331) + 
         0.00391838 * Math.pow(100 * humidity, 1.5) * 
         Math.atan(0.023101 * 100 * humidity) - 4.686035;
};

/**
 * Расчёт суммарного коэффициента сопротивления
 * Формула: z = zок + hор*(zсо + Kор*qж) + 0,1*L + zву (из листа ВОДЭХ-144, ячейка C32)
 * @param {number} zso - Коэффициент сопротивления оросителя (8.2 по умолчанию)
 * @param {number} zvu - Коэффициент сопротивления водоуловителя (6 по умолчанию)
 * @param {number} zok - Коэффициент сопротивления окон (8 по умолчанию)
 * @param {number} hor - Высота оросителя [м]
 * @param {number} kor - Поправочный коэффициент (0.541 по умолчанию)
 * @param {number} qx - Плотность орошения [м³/(м²·ч)]
 * @param {number} L - Длина воздухораспределителя [м]
 * @returns {number} Суммарный коэффициент сопротивления
 */
const calcTotalResistance = (zso, zvu, zok, hor, kor, qx, L) => {
  return zok + hor * (zso + kor * qx) + 0.1 * L + zvu;
};

/**
 * Расчёт статического давления вентилятора [Па]
 * Формула: Pс = (wгр² * g1 * z) / 2 (из листа ВОДЭХ-144, ячейка H30)
 * @param {number} wgr - Скорость воздуха в градирне [м/с]
 * @param {number} density - Плотность воздуха [кг/м³]
 * @param {number} zTotal - Суммарный коэффициент сопротивления
 * @returns {number} Статическое давление [Па]
 */
const calcStaticPressure = (wgr, density, zTotal) => {
  return (Math.pow(wgr, 2) * density * zTotal) / 2;
};

/**
 * Расчёт динамического давления вентилятора [Па]
 * Формула: Pдин = (wвен² * g1) / 2 (из листа ВОДЭХ-144, ячейка H31)
 * @param {number} wven - Скорость воздуха в вентиляторе [м/с]
 * @param {number} density - Плотность воздуха [кг/м³]
 * @returns {number} Динамическое давление [Па]
 */
const calcDynamicPressure = (wven, density) => {
  return (Math.pow(wven, 2) * density) / 2;
};

/**
 * Расчёт полного давления вентилятора [Па]
 * Формула: Pпол = Pс + Pдин (из листа ВОДЭХ-144, ячейка H32)
 * @param {number} pStatic - Статическое давление [Па]
 * @param {number} pDynamic - Динамическое давление [Па]
 * @returns {number} Полное давление [Па]
 */
const calcTotalPressure = (pStatic, pDynamic) => {
  return pStatic + pDynamic;
};

/**
 * Расчёт производительности вентилятора [м³/ч]
 * Формула: Gв = Gж * λ * (ρ_воды / ρ_воздуха) (из листа ВОДЭХ-144, ячейка H33)
 * @param {number} gj - Расход воды через секцию [м³/ч]
 * @param {number} lambda - Соотношение воздух/вода
 * @param {number} density - Плотность воздуха [кг/м³]
 * @returns {number} Производительность вентилятора [м³/ч]
 */
export const calcFanPerformance = (gj, lambda, density) => {
  return gj * lambda * (PHYSICS.WATER_DENSITY / density);
};

/**
 * Расчёт потребляемой мощности [кВт]
 * Формула: N0 = Gв * Pпол / (1,3·10⁴ * g1 * hк * (tср + 273)) (из листа ВОДЭХ-144, ячейка H36)
 * @param {number} gv - Производительность вентилятора [м³/ч]
 * @param {number} pTotal - Полное давление [Па]
 * @param {number} density - Плотность воздуха [кг/м³]
 * @param {number} etaK - КПД вентилятора (0.69 по умолчанию)
 * @param {number} tAvg - Средняя температура воды [°C]
 * @returns {number} Потребляемая мощность [кВт]
 */
const calcPowerConsumption = (gv, pTotal, density, etaK, tAvg) => {
  return (gv * pTotal) / (1.3 * Math.pow(10, 4) * density * etaK * (tAvg + 273));
};

/**
 * Расчёт минимальной мощности привода [кВт]
 * Формула: N = N0 / ηп (из листа ВОДЭХ-144, ячейка H37)
 * @param {number} n0 - Потребляемая мощность [кВт]
 * @param {number} etaP - КПД передачи (0.95 для пластикового вала)
 * @returns {number} Минимальная мощность привода [кВт]
 */
const calcMinDrivePower = (n0, etaP) => {
  if (etaP <= 0) throw new Error("КПД передачи должен быть > 0");
  return n0 / etaP;
};

/**
 * Расчёт соотношения воздух/вода (λ) для градирни
 * Формула: λ = Qвент_макс / Gж (из листа ВОДЭХ-144, ячейка C11)
 * @param {number} g1 - Общий расход воды через градирню [м³/ч]
 * @param {number} n - Количество секций градирни
 * @returns {number} Соотношение воздух/вода (безразмерная величина)
 * @throws {Error} Если g1 или n <= 0
 */
const calcLambda = (g1, n) => {
  if (!g1 || g1 <= 0 || !n || n <= 0) return 0;
  const lambda = 1100000 / (g1 / n); // 1100000 - максимальный расход воздуха для ВОДЭХ-144
  return Math.min(lambda, DEFAULTS.MAX_LAMBDA); // Ограничение по максимальному соотношению
};

/**
 * Получение всех расчётных параметров градирни
 * @param {Object} values - Входные данные формы
 * @returns {Object} Все расчётные параметры + данные для графика
 * @throws {Error} При некорректных входных данных
 */
export const getCalculationResults = (values) => {
  if (!values) throw new Error("Отсутствуют входные данные");
  
  try {
    // Полная деструктуризация с значениями по умолчанию
    const { 
      initialData: { 
        g1 = 0, 
        n = 1, 
        t1 = 0, 
        t2 = 0 
      } = {},
      airParameters: { 
        humidity = 0, 
        temperature_dry = 0, 
        barometric_press = DEFAULTS.PRESSURE 
      } = {},
      towerParameters: { 
        width = 0, 
        length = 0, 
        fanDiameter = 0, 
        windowHeight = 0 
      } = {},
      sprinklerCharacteristics: { 
        a0 = DEFAULTS.SPRAY_EFFICIENCY, 
        m = DEFAULTS.RESISTANCE_COEFF, 
        kor = DEFAULTS.CORRECTION_FACTOR, 
        hor = DEFAULTS.SPRAY_HEIGHT 
      } = {},
      resistanceCoefficients: { 
        zso = DEFAULTS.ZSO, 
        zvu = DEFAULTS.ZVU, 
        zok = DEFAULTS.ZOK 
      } = {},
      efficiency: { 
        etaK = DEFAULTS.ETA_K, 
        etaP = DEFAULTS.ETA_P 
      } = {},
      city = "Не указан"
    } = values;

    // Проверка на отрицательные значения 
    if ([g1, width, length].some(v => v < 0)) {
      throw new Error("Основные параметры не могут быть отрицательными: расход воды (g1), ширина (width) и длина (length) должны быть ≥ 0");
    }

    // 1. Расчёт геометрических параметров
    const area = width * length;
    const L = width / 4;
    const tAvg = (t1 + t2) / 2;
    const windowArea = length * n * windowHeight;

    // 2. Основные гидравлические параметры
    const gg = calcGg(g1, n);
    const qx = calcGx(g1, area);
    const lambda = calcLambda(g1, n);
    const heatPower = calcQ(g1, t1, t2);

    // 3. Расчёт потерь воды
    const evaporationLoss = calcGi(gg, t1, t2);
    const dropletLoss = calcGy(g1);
    const blowdownLoss = ((evaporationLoss / 4) - dropletLoss).toFixed(2); // Kуп = 5 (1/(5-1) = 0.25)
    const totalWaterLoss = (parseFloat(evaporationLoss) + parseFloat(dropletLoss) + parseFloat(blowdownLoss)).toFixed(2);

    // 4. Расчёт вентиляторной системы
    const zTotal = calcTotalResistance(zso, zvu, zok, hor, kor, qx, L);
    const gv = calcFanPerformance(gg, lambda, PHYSICS.WATER_DENSITY);
    const wgr = gv / (3600 * area);
    const wven = gv / (Math.PI * Math.pow(fanDiameter/2, 2) * 3600);
    
    const pStatic = calcStaticPressure(wgr, PHYSICS.WATER_DENSITY, zTotal);
    const pDynamic = calcDynamicPressure(wven, PHYSICS.WATER_DENSITY);
    const pTotal = pStatic + pDynamic;
    
    const n0 = calcPowerConsumption(gv, pTotal, PHYSICS.WATER_DENSITY, etaK, tAvg);
    const nMin = calcMinDrivePower(n0, etaP);

    // 5. Температурные характеристики
    const wetBulbTemp = calcWetBulbTemp(temperature_dry, humidity);
    const tempDifference = t1 - t2;

    // 6. Формирование результатов
    return {
      performance: {
        "Производительность градирни": `${g1} м³/ч`,
        "Производительность секции": `${gg.toFixed(2)} м³/ч`,
        "Плотность орошения": `${qx.toFixed(2)} м³/(м²·ч)`,
        "Тепловая мощность": `${heatPower.toFixed(4)} МВт`,
        "Соотношение воздух/вода": `${lambda.toFixed(2)}`
      },
      
      waterLoss: {
        "Испарение": `${evaporationLoss.toFixed(2)} м³/ч`,
        "Капельный унос": `${dropletLoss.toFixed(2)} м³/ч`,
        "Продувка": `${blowdownLoss} м³/ч`,
        "Общие потери": `${totalWaterLoss} м³/ч`
      },
      
      geometry: {
        "Площадь орошения": `${area.toFixed(2)} м²`,
        "Длина воздухораспределителя": `${L.toFixed(2)} м`,
        "Площадь окон": `${windowArea.toFixed(2)} м²`,
        "Диаметр вентилятора": `${fanDiameter.toFixed(2)} м`
      },
      
      fanSystem: {
        "Суммарное сопротивление": `${zTotal.toFixed(2)}`,
        "Производительность вентилятора": `${gv.toFixed(2)} м³/ч`,
        "Скорость воздуха в градирне": `${wgr.toFixed(2)} м/с`,
        "Скорость в вентиляторе": `${wven.toFixed(2)} м/с`,
        "Статическое давление": `${pStatic.toFixed(2)} Па`,
        "Динамическое давление": `${pDynamic.toFixed(2)} Па`,
        "Полное давление": `${pTotal.toFixed(2)} Па`,
        "Потребляемая мощность": `${n0.toFixed(2)} кВт`,
        "Мощность привода": `${nMin.toFixed(2)} кВт`
      },
      
      temperatures: {
        "Температура по сухому терм.": `${temperature_dry} °C`,
        "Температура по влажному терм.": `${wetBulbTemp.toFixed(1)} °C`,
        "Средняя температура воды": `${tAvg.toFixed(1)} °C`,
        "Перепад температур": `${tempDifference.toFixed(1)} °C`
      },
      
      sprinkler: {
        "Эффективность оросителя": a0,
        "Коэффициент сопротивления": m.toFixed(2),
        "Высота оросителя": `${hor.toFixed(2)} м`
      },
      
      charts: {
        "График зависимости": generateChartData(g1, t1, t2, pStatic)
      },
      
      meta: {
        "Город": city,
        "Кол-во секций": n,
        "Атм. давление": `${barometric_press} кПа`,
        "Влажность воздуха": `${humidity}%`
      },
      
      inputData: values // Добавляем исходные данные формы
    };
    
  } catch (error) {
    console.error("Расчётная ошибка:", error);
    throw new Error(`Не удалось выполнить расчёты: ${error.message}`);
  }
};

/**
 * Экспорт всех расчётных функций модуля
 */
export default {
  calcGx,
  calcGg,
  calcQ,
  calcGy,
  calcGi,
  calcWetBulbTemp,
  calcTotalResistance,
  calcStaticPressure,
  calcDynamicPressure,
  calcTotalPressure,
  calcFanPerformance,
  calcPowerConsumption,
  calcMinDrivePower,
  generateChartData,
  calcLambda,
  getCalculationResults
};