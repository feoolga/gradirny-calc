import { ResultField } from "./ResultField";
import { Section } from "./Section";

// CalculationForInitialDataSection.jsx
export const CalculationForInitialDataSection = ({ results }) => {
  if (!results) return null;
  
  return (
    <Section title="Расчётные параметры по исходным данным">
      {/* <ResultField
        label="Производительность градирни"
        value={results["Производительность градирни"]}
      /> */}
      <ResultField
        label="Производительность секции"
        value={results.performance["Производительность секции"]}
      />
      <ResultField
        label="Плотность орошения"
        value={results.performance["Плотность орошения"]}
      />
      <ResultField
        label="Средняя температура воды"
        value={results.temperatures["Средняя температура воды"]}
      />
      <ResultField
        label="Мощность"
        value={results.performance["Тепловая мощность"]}
      />
      <ResultField
        label="Соотношение воды и воздуха"
        value={results.performance?.["Соотношение воздух/вода"] ?? "Н/д"}
      />
    </Section>
  );
};