import React, { useState, useEffect, useMemo } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from 'react-bootstrap';
import { InitialDataSection } from "./InitialDataSection";
import { TowerParametersSection } from "./TowerParametersSection";
import { ParametersOutdoorAirSection } from "./ParametersOutdoorAirSection";
import { SprinklerCharacteristicsSection } from "./SprinklerCharacteristicsSection";
import { CalculationForInitialDataSection } from "./CalculationForInitialDataSection";
import { CalculationForTowerParametersSection } from "./CalculationForTowerParametersSection";
import { CalculationForParametersOutdoorAirSection } from "./CalculationForParametersOutdoorAirSection";
import { FanSystemResultsSection } from "./FanSystemResultsSection";
import { useNavigate } from 'react-router-dom';
import { calculations } from '../utils/calculations';
import { PHYSICS } from '../utils/constants';

const validationSchema = Yup.object({
  // ... ваша схема валидации (оставьте без изменений)
});

export const CalculationForm = () => {
  const navigate = useNavigate();
  const [autoResults, setAutoResults] = useState({ 
    gx: '0', 
    gg: '0', 
    q: '0', 
    gi: '0', 
    gy: '0' 
  });

  // 1. Инициализация Formik (должно быть в начале компонента)
  const formik = useFormik({
    initialValues: {
      initialData: {
        g1: 7500,
        n: 3,
        t1: 46,
        t2: 35,
      },
      towerParameters: {
        width: 12,
        length: 12,
        fanDiameter: 7,
        windowHeight: 1.9,
      },
      airParameters: {
        humidity: 32,
        temperature_dry: 32,
        barometric_press: 100.4,
      },
      sprinklerCharacteristics: {
        a0: 0.858,
        m: 0.3,
        kor: 0.541,
        hor: 0.9,
      },
      resistanceCoefficients: {
        zso: 8.2,
        zvu: 6,
        zok: 8,
      },
      efficiency: {
        etaK: 0.69,
        etaP: 1,
      },
    },
    validationSchema,
    onSubmit: (values) => {
      const results = calculations.getCalculationResults(values);
      navigate('/results-table', { state: { results } });
    },
  });

  // 2. Получаем значения из formik
  const { values } = formik;
  const { g1, n, t1, t2 } = values.initialData || {};
  const { width, length, fanDiameter, windowHeight } = values.towerParameters || {};
  const { humidity, temperature_dry, barometric_press } = values.airParameters || {};
  const { a0, m, kor, hor } = values.sprinklerCharacteristics || {};
  const { zso, zvu, zok } = values.resistanceCoefficients || {};
  const { etaK, etaP } = values.efficiency || {};

  // 3. Оптимизированные вычисления с useMemo
  const area = useMemo(() => width * length, [width, length]);
  const L = useMemo(() => width / 4, [width]);
  const tAvg = useMemo(() => (parseFloat(t1) + parseFloat(t2)) / 2, [t1, t2]);

  const gg = useMemo(() => calculations.calcGg(g1, n), [g1, n]);
  const qx = useMemo(() => calculations.calcGx(g1, area), [g1, area]);
  const gi = useMemo(() => calculations.calcGi(gg, t1, t2), [gg, t1, t2]);
  const gy = useMemo(() => calculations.calcGy(g1), [g1]);
  const gp = useMemo(() => (gi / 4 - gy).toFixed(2), [gi, gy]);
  const gd = useMemo(() => (parseFloat(gi) + parseFloat(gy) + parseFloat(gp)).toFixed(2), [gi, gy, gp]);
  const lambda = useMemo(() => calculations.calcLambda(g1, n), [g1, n]);

  const zTotal = useMemo(() => 
    calculations.calcTotalResistance(zso, zvu, zok, hor, kor, qx, L), 
    [zso, zvu, zok, hor, kor, qx, L]
  );

  const gv = useMemo(() => 
    calculations.calcFanPerformance(gg, lambda, PHYSICS.WATER_DENSITY), 
    [gg, lambda]
  );

  const wgr = useMemo(() => gv / (3600 * area), [gv, area]);
  const wven = useMemo(() => 
    gv / (Math.PI * Math.pow(fanDiameter/2, 2) * 3600), 
    [gv, fanDiameter]
  );

  const pStatic = useMemo(() => 
    calculations.calcStaticPressure(wgr, PHYSICS.WATER_DENSITY, zTotal), 
    [wgr, zTotal]
  );

  const pDynamic = useMemo(() => 
    calculations.calcDynamicPressure(wven, PHYSICS.WATER_DENSITY), 
    [wven]
  );

  const pTotal = useMemo(() => 
    calculations.calcTotalPressure(pStatic, pDynamic), 
    [pStatic, pDynamic]
  );

  const n0 = useMemo(() => 
    calculations.calcPowerConsumption(gv, pTotal, PHYSICS.WATER_DENSITY, etaK, tAvg), 
    [gv, pTotal, etaK, tAvg]
  );

  const nMin = useMemo(() => 
    calculations.calcMinDrivePower(n0, etaP), 
    [n0, etaP]
  );

  // 4. Обновление результатов
  useEffect(() => {
    if (g1 && t1 && t2 && n && width && length && windowHeight && 
        humidity !== undefined && temperature_dry !== undefined &&
        a0 && m && kor && hor && zso && zvu && zok && etaK && etaP) {
      
      setAutoResults({
        // Основные параметры
        wetBulbTemp: calculations.calcWetBulbTemp(temperature_dry, humidity).toFixed(1),
        gx: qx.toFixed(2),
        gg: gg.toFixed(2),
        q: calculations.calcQ(g1, t1, t2).toFixed(2),
        gi: gi.toFixed(2),
        gy: gy.toFixed(2),
        gp: gp,
        gd: gd,
        lambda: lambda.toFixed(2),
        
        // Параметры градирни
        towerArea: area.toFixed(2),
        airDistributorLength: L.toFixed(2),
        windowArea: (length * n * windowHeight).toFixed(2),
        
        // Вентиляторная установка (для FanSystemResultsSection)
        staticPressure: pStatic.toFixed(2),
        dynamicPressure: pDynamic.toFixed(2),
        totalPressure: pTotal.toFixed(2),
        fanPerformance: gv.toFixed(2),
        airSpeedFan: wven.toFixed(2),
        airSpeedTower: wgr.toFixed(2),
        powerConsumption: n0.toFixed(2),
        minDrivePower: nMin.toFixed(2),
        totalResistance: zTotal.toFixed(2),
        
        // Дополнительные параметры
        averageTemp: tAvg.toFixed(1),
        sprinklerEfficiency: a0,
        resistanceCoefficient: m.toFixed(2)
      });
    }
  }, [
    g1, t1, t2, n, width, length, windowHeight,
    humidity, temperature_dry, a0, m, kor, hor,
    zso, zvu, zok, etaK, etaP, qx, gg, gi, gy,
    gp, gd, lambda, area, L, pStatic, pDynamic,
    pTotal, gv, wven, wgr, n0, nMin, zTotal, tAvg
  ]);

  return (
    <div className="container">
      <form onSubmit={formik.handleSubmit}>
        <h2 className="mb-2 text-light text-center">Теплотехнический расчёт градирни</h2>
        <div className="row">
          <div className="col">
            <InitialDataSection formik={formik} />
          </div>
          <div className="col">
            {/* <h2 className="mb-2 text-light text-center">Заказчик:</h2> */}
            <CalculationForInitialDataSection  
              formik={formik} 
              autoResults={autoResults} 
            />
          </div>
        </div>

        <div className="row">
          <div className="col">
            <TowerParametersSection formik={formik} />
          </div>
          <div className="col">
            <CalculationForTowerParametersSection 
              formik={formik} 
              autoResults={autoResults} 
            />
          </div>
        </div>

        <div className="row">
          <div className="col">
            <ParametersOutdoorAirSection formik={formik} />
          </div>
          <div className="col">
            <CalculationForParametersOutdoorAirSection 
              formik={formik} 
              autoResults={autoResults} 
            />
          </div>
        </div>

        <div className="row">
          <div className="col">
            <SprinklerCharacteristicsSection formik={formik} />
          </div>
          <div className="col">
            <FanSystemResultsSection 
              formik={formik} 
              autoResults={autoResults} 
            />
          </div>
        </div>

        <Button 
          type="submit" 
          variant="primary" 
          className="my-2"
          disabled={!formik.isValid || formik.isSubmitting}
        >
          {formik.isSubmitting ? 'Вычисляем...' : 'Рассчитать'}
        </Button>
      </form>
    </div>
  );
};