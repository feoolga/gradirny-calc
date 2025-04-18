import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from 'react-bootstrap';
import { InitialDataSection  } from "./InitialDataSection";
import { ParametersOutdoorAirSection } from "./ParametersOutdoorAirSection";
import { CalculationIntermediateValuesSection } from "./CalculationIntermediateValuesSection";
import { CalculationWaterDebetSection } from "./CalculationWaterDebetSection";
import { useNavigate } from 'react-router-dom';
import { calculations } from '../utils/calculations';
// import getCalculationResults from '../utils/calculations';

const validationSchema = Yup.object({
  initialData: Yup.object({
    g1: Yup.number().required("Обязательное поле").min(1000, "Минимум 1000 м³/ч"),
    n: Yup.number().required("Обязательное поле").min(1, "Минимум 1 секция"),
    t1: Yup.number().max(100, "Слишком высокая температура"),
    t2: Yup.number().max(100, "Слишком высокая температура"),
  }),
  airParameters: Yup.object({
    humidity: Yup.number()
      .required("Укажите влажность")
      .min(0, "Минимум 0%")
      .max(100, "Максимум 100%"),
    temperature_dry: Yup.number()
      .required("Укажите температуру")
      .min(0, "Минимум 0%")
      .max(100, "Максимум 100%"),
    barometric_press: Yup.number()
      .required("Укажите давление")
      .min(90, "Минимум 90 кПа")
      .max(110, "Максимум 110 кПа"),
  }),
});

export const CalculationForm = () => {
  const navigate = useNavigate();
  const [autoResults, setAutoResults] = useState({ gx: '0', gg: '0', q: '0', gi: '0', gy: '0' });

  const formik = useFormik({
    initialValues: {
      initialData: {
        g1: 7500,
        n: 3,
        t1: 46,
        t2: 35,
      },
      airParameters: {
        humidity: 60,
        temperature_dry: 32,
        barometric_press: 100.4,
      },
      IntermediateValues: {
        q1: 4.746,
      },
    },
    validationSchema,
    onSubmit: (values) => {
      // +++ Используем новую функцию из утилит
      const results = calculations.getCalculationResults(values);
      navigate('/results-table', { state: { results } });
    },
  });

  useEffect(() => {
    const { g1, t1, t2, n } = formik.values.initialData || {};
    if (g1 && t1 && t2 && n) {
      const gg = calculations.calcGg(g1, n); // Рассчитываем gg здесь
      setAutoResults({
        gx: calculations.calcGx(g1).toFixed(2),
        gg: gg.toFixed(2), // Используем рассчитанное значение
        q: calculations.calcQ(g1, t1, t2).toFixed(2),
        gi: calculations.calcGi(gg, t1, t2).toFixed(2), // Теперь gg определено
        gy: calculations.calcGy(g1).toFixed(2)
      });
    }
  }, [formik.values.initialData]);

  return (
    <div className="container">
      <form onSubmit={formik.handleSubmit}>
        <div className="row">
          <div className="col">
            <h2 className="mb-2 text-light text-center">Теплотехнический расчёт градирни</h2>
            <InitialDataSection formik={formik} />
            <ParametersOutdoorAirSection formik={formik} />
          </div>
          <div className="col">
            <h2 className="mb-2 text-light text-center">Заказчик:</h2>
            <CalculationIntermediateValuesSection 
              formik={formik} 
              autoResults={autoResults} 
            />
            <CalculationWaterDebetSection 
              formik={formik} 
              autoResults={autoResults} 
            />
          </div>
        </div>

        <Button type="submit" variant="primary" className="mt-3">
          Рассчитать
        </Button>
      </form>

    </div>
  );
};