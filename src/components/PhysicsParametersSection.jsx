import { ResultField } from "./ResultField";
import { Section } from "./Section";

export const PhysicsParametersSection = ({ results }) => {
  if (!results || Object.keys(results).length === 0) return null;

  return (
    <Section title="Физические параметры">
      <ResultField
        label="Плотность воздуха (ρ)"
        value={results["Плотность воздуха"] ?? "Расчётное"}
      />
      <ResultField
        label="Плотность воды"
        value={results["Плотность воды"] ?? "Константа"}
      />
      <ResultField
        label="Теплоёмкость воды (cж)"
        value={results["Теплоёмкость воды"] ?? "Константа"}
      />
      <ResultField
        label="Теплота парообразования (r)"
        value={results["Теплота парообразования"] ?? "Константа"}
      />
    </Section>
  );
};