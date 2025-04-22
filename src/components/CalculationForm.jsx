import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from 'react-bootstrap';
import { InitialDataSection } from "./InitialDataSection";
import { TowerParametersSection } from "./TowerParametersSection"; // Добавлен импорт
import { ParametersOutdoorAirSection } from "./ParametersOutdoorAirSection";
import { CalculationForInitialDataSection } from "./CalculationForInitialDataSection";
import { CalculationForTowerParametersSection } from "./CalculationForTowerParametersSection";
import { CalculationForParametersOutdoorAirSection } from "./CalculationForParametersOutdoorAirSection";
import { useNavigate } from 'react-router-dom';
import { calculations } from '../utils/calculations';

const validationSchema = Yup.object({
  initialData: Yup.object({
    g1: Yup.number().required("Обязательное поле").min(1000, "Минимум 1000 м³/ч"),
    n: Yup.number().required("Обязательное поле").min(1, "Минимум 1 секция").integer("Должно быть целым числом"),
    t1: Yup.number().required("Обязательное поле").min(0, "Минимум 0°C").max(100, "Максимум 100°C"),
    t2: Yup.number().required("Обязательное поле").min(0, "Минимум 0°C").max(100, "Максимум 100°C")
      .test('t2-less-t1', 't₂ должна быть меньше t₁', function(value) {
        return value < this.parent.t1;
      }),
  }),
  towerParameters: Yup.object({
    width: Yup.number().required("Обязательное поле").min(1, "Минимум 1 м").max(50, "Максимум 50 м"),
    length: Yup.number().required("Обязательное поле").min(1, "Минимум 1 м").max(50, "Максимум 50 м"),
    fanDiameter: Yup.number().required("Обязательное поле").min(0.5, "Минимум 0.5 м").max(20, "Максимум 20 м"),
    windowHeight: Yup.number().required("Обязательное поле").min(0.5, "Минимум 0.5 м").max(10, "Максимум 10 м"),
  }),
  airParameters: Yup.object({
    humidity: Yup.number()
      .required("Укажите влажность")
      .min(0, "Минимум 0%")
      .max(100, "Максимум 100%"),
    temperature_dry: Yup.number()
      .required("Укажите температуру")
      .min(-50, "Минимум -50°C")
      .max(60, "Максимум 60°C"),
    barometric_press: Yup.number()
      .required("Укажите давление")
      .min(90, "Минимум 90 кПа")
      .max(110, "Максимум 110 кПа"),
  }),
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

  const formik = useFormik({
    initialValues: {
      initialData: {
        g1: 7500,
        n: 3,
        t1: 46,
        t2: 35,
      },
      towerParameters: {
        width: 12, // Исправлено на реальные значения по умолчанию
        length: 12,
        fanDiameter: 7,
        windowHeight: 1.9,
      },
      airParameters: {
        humidity: 32, // Исправлено на 32% (как в Excel)
        temperature_dry: 32,
        barometric_press: 100.4,
      },
    },
    validationSchema,
    onSubmit: (values) => {
      const results = calculations.getCalculationResults(values);
      navigate('/results-table', { state: { results } });
    },
  });

  useEffect(() => {
    const { g1, t1, t2, n } = formik.values.initialData || {};
    const { width, length, windowHeight } = formik.values.towerParameters || {};
    const { humidity, temperature_dry } = formik.values.airParameters || {};
  
    if (g1 && t1 && t2 && n && width && length && windowHeight && humidity !== undefined && temperature_dry !== undefined) {
      const gg = calculations.calcGg(g1, n);
      const gi = calculations.calcGi(gg, t1, t2);
      const gy = calculations.calcGy(g1);
      const gp = (gi / 4 - gy).toFixed(2); // Gп = Gi/(Kуп - 1) - Gy
      const gd = (parseFloat(gi) + parseFloat(gy) + parseFloat(gp)).toFixed(2); // Gd = Gi + Gy + Gп
  
      setAutoResults({
        wetBulbTemp: calculations.calcWetBulbTemp(temperature_dry, humidity).toFixed(1),
        gx: calculations.calcGx(g1, width * length).toFixed(2),
        gg: gg.toFixed(2),
        q: calculations.calcQ(g1, t1, t2).toFixed(2),
        gi: gi.toFixed(2),
        gy: gy.toFixed(2),
        gp: gp,
        gd: gd,
        lambda: calculations.calcLambda(g1, n).toFixed(2),
        towerArea: (width * length).toFixed(2),
        airDistributorLength: (width / 4).toFixed(2),
        windowArea: (length * n * windowHeight).toFixed(2)
      });
    }
  }, [formik.values.initialData, formik.values.towerParameters, formik.values.airParameters]);

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