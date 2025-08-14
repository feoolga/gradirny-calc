import React, { useState, useEffect, useMemo } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from 'react-bootstrap';
import { InitialDataSection } from "./InitialDataSection";
import { TowerParametersSection } from "./TowerParametersSection";
import { ParametersOutdoorAirSection } from "./ParametersOutdoorAirSection";
import { SprinklerCharacteristicsSection } from "./SprinklerCharacteristicsSection";
import { useNavigate, useLocation } from 'react-router-dom';
import calculations from '../utils/calculations';
import { PHYSICS } from '../utils/constants';

const validationSchema = Yup.object({
  city: Yup.string().required('Укажите город'),
  sprinklerName: Yup.string().required('Выберите модель оросителя'),
  initialData: Yup.object({
    g1: Yup.number().required("Обязательное поле").min(50, "Минимум 50 м³/ч").max(20000, "Максимум 20000 м³/ч"),
    n: Yup.number().required("Обязательное поле").min(1, "Минимум 1 секция").max(20, "Максимум 20 секций").integer("Должно быть целым числом"),
    t1: Yup.number().required("Обязательное поле").min(20, "Минимум 20°C").max(65, "Максимум 65°C"),
    t2: Yup.number().required("Обязательное поле").min(13, "Минимум 13°C").max(40, "Максимум 40°C")
      .test('t2-less-t1', 't₂ должна быть меньше t₁', function(value) {
        if (!value || !this.parent.t1) return true;
        return value < this.parent.t1;
      }),
  }),
  towerParameters: Yup.object({
    width: Yup.number().required("Обязательное поле").min(2, "Минимум 2 м").max(22, "Максимум 22 м"),
    length: Yup.number().required("Обязательное поле").min(2, "Минимум 2 м").max(22, "Максимум 22 м"),
    fanDiameter: Yup.number().required("Обязательное поле").min(0.6, "Минимум 0.6 м").max(20, "Максимум 20 м"),
    windowHeight: Yup.number().required("Обязательное поле").min(0.8, "Минимум 0.8 м").max(6, "Максимум 6 м"),
  }),
  airParameters: Yup.object({
    humidity: Yup.number()
      .required("Укажите влажность")
      .min(10, "Минимум 10%")
      .max(99, "Максимум 99%"),
    temperature_dry: Yup.number()
      .required("Укажите температуру")
      .min(12, "Минимум 12°C")
      .max(40, "Максимум 40°C"),
    barometric_press: Yup.number()
      .required("Укажите давление")
      .min(90, "Минимум 90 кПа")
      .max(110, "Максимум 110 кПа"),
  }),
  sprinklerCharacteristics: Yup.object({
    a0: Yup.number().required("Обязательное поле").min(0.1, "Минимум 0.1").max(2, "Максимум 2"),
    m: Yup.number().required("Обязательное поле").min(0.1, "Минимум 0.1").max(1, "Максимум 1"),
    kor: Yup.number().required("Обязательное поле").min(0.1, "Минимум 0.1").max(2, "Максимум 2"),
    hor: Yup.number().required("Обязательное поле").min(0.1, "Минимум 0.1 м").max(5, "Максимум 5 м"),
  }),
  resistanceCoefficients: Yup.object({
    zso: Yup.number().required("Обязательное поле").min(1, "Минимум 1").max(20, "Максимум 20"),
    zvu: Yup.number().required("Обязательное поле").min(1, "Минимум 1").max(20, "Максимум 20"),
    zok: Yup.number().required("Обязательное поле").min(1, "Минимум 1").max(20, "Максимум 20"),
  }),
  efficiency: Yup.object({
    etaK: Yup.number().required("Обязательное поле").min(0.1, "Минимум 0.1").max(1, "Максимум 1"),
    etaP: Yup.number().required("Обязательное поле").min(0.1, "Минимум 0.1").max(1, "Максимум 1"),
  }),
});

const defaultValues = {
  city: 'Волгоград',
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
};

export const CalculationForm = () => {
  const location = useLocation();
  const savedData = location.state?.savedFormData;
  const navigate = useNavigate();
  
  const [autoResults, setAutoResults] = useState({ 
    gx: '0', 
    gg: '0', 
    q: '0', 
    gi: '0', 
    gy: '0' 
  });

  const formik = useFormik({
    initialValues: savedData || defaultValues,
    validationSchema,
    onSubmit: (values) => {
      const results = calculations.getCalculationResults(values);
      navigate('/results-page', { 
        state: { 
          results,
          inputData: values // Сохраняем исходные данные для возврата
        } 
      });
    },
  });

  const { values } = formik;
  const { g1, n, t1, t2 } = values.initialData || {};
  const { width, length, fanDiameter, windowHeight } = values.towerParameters || {};
  const { humidity, temperature_dry, barometric_press } = values.airParameters || {};
  const { a0, m, kor, hor } = values.sprinklerCharacteristics || {};
  const { zso, zvu, zok } = values.resistanceCoefficients || {};
  const { etaK, etaP } = values.efficiency || {};

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

  const wetBulbTemp = useMemo(() => {
    if (temperature_dry !== undefined && humidity !== undefined) {
      // Конвертируем влажность из % в доли (32% -> 0.32)
      const humidityFraction = humidity / 100;
      return calculations.calcWetBulbTemp(temperature_dry, humidityFraction).toFixed(1);
    }
    return null;
  }, [temperature_dry, humidity]);

  useEffect(() => {
    if (g1 && t1 && t2 && n && width && length && windowHeight && 
        humidity !== undefined && temperature_dry !== undefined &&
        a0 && m && kor && hor && zso && zvu && zok && etaK && etaP) {
      
      setAutoResults({
        wetBulbTemp: wetBulbTemp,
        gx: qx.toFixed(2),
        gg: gg.toFixed(2),
        q: calculations.calcQ(g1, t1, t2).toFixed(2),
        gi: gi.toFixed(2),
        gy: gy.toFixed(2),
        gp: gp,
        gd: gd,
        lambda: lambda.toFixed(2),
        towerArea: area.toFixed(2),
        airDistributorLength: L.toFixed(2),
        windowArea: (length * n * windowHeight).toFixed(2),
        staticPressure: pStatic.toFixed(2),
        dynamicPressure: pDynamic.toFixed(2),
        totalPressure: pTotal.toFixed(2),
        fanPerformance: gv.toFixed(2),
        airSpeedFan: wven.toFixed(2),
        airSpeedTower: wgr.toFixed(2),
        powerConsumption: n0.toFixed(2),
        minDrivePower: nMin.toFixed(2),
        totalResistance: zTotal.toFixed(2),
        averageTemp: tAvg.toFixed(1),
        sprinklerEfficiency: a0,
        resistanceCoefficient: m.toFixed(2),
        city: values.city
      });
    }
  }, [
    wetBulbTemp, g1, t1, t2, n, width, length, windowHeight,
    humidity, temperature_dry, a0, m, kor, hor,
    zso, zvu, zok, etaK, etaP, qx, gg, gi, gy,
    gp, gd, lambda, area, L, pStatic, pDynamic,
    pTotal, gv, wven, wgr, n0, nMin, zTotal, tAvg,
    values.city
  ]);

  return (
    <div className="container">
      <form onSubmit={formik.handleSubmit}>
        <h2 className="mb-2 text-light text-center">Теплотехнический расчёт градирни</h2>
        
        <div className="row">
          <div className="col">
            <InitialDataSection formik={formik} />
            <TowerParametersSection formik={formik} />
            <ParametersOutdoorAirSection formik={formik} />
          </div>
          <div className="col">
            <SprinklerCharacteristicsSection formik={formik} />
          </div>
        </div>

        <Button 
          type="submit" 
          variant="primary" 
          className="my-2"
          disabled={!formik.isValid || formik.isSubmitting || !formik.values.sprinklerName}
        >
          {formik.isSubmitting ? 'Вычисляем...' : 'Рассчитать'}
        </Button>

        {!formik.values.sprinklerName && (
          <span className="text-warning mt-1 ms-3">
            ⚠️ Выберите модель оросителя
          </span>
        )}
      </form>
    </div>
  );
};