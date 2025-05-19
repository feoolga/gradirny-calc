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
        value={results["Производительность секции"]}
      />
      <ResultField
        label="Плотность орошения"
        value={results["Плотность орошения"]}
      />
      <ResultField
        label="Средняя температура воды"
        value={results["Средняя температура воды"]}
      />
      <ResultField
        label="Мощность"
        value={results["Тепловая мощность"]}
      />
      <ResultField
        label="Соотношение воды и воздуха"
        value={results["Соотношение воздух/вода"]}
      />
    </Section>
  );
};