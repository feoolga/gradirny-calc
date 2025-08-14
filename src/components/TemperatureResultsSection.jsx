import { ResultField } from "./ResultField";
import { Section } from "./Section";

export const TemperatureResultsSection = ({ results }) => {
  if (!results || Object.keys(results).length === 0) return null;

  return (
    <Section title="Температурные параметры">
      <ResultField
        label="Температура по сухому термометру (θ1)"
        value={results["Температура по сухому терм."] ?? "Н/д"}
      />
      <ResultField
        label="Температура по влажному термометру (τ)"
        value={results["Температура по влажному терм."] ?? "Расчётное"}
      />
      <ResultField
        label="Средняя температура воды (tср)"
        value={results["Средняя температура воды"] ?? "Расчётное"}
      />
      <ResultField
        label="Перепад температур воды (Δt)"
        value={results["Перепад температур"] ?? "Расчётное"}
      />
    </Section>
  );
};