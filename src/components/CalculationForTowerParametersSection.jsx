import { ResultField } from "./ResultField";
import { Section } from "./Section";

export const CalculationForTowerParametersSection = ({ results }) => {
  // Проверяем наличие данных
  if (!results?.geometry) return null;

  return (
    <Section title="Расчётные параметры градирни">
      <ResultField
        label="Площадь орошения секции (fор)"
        value={results.geometry["Площадь орошения"] || "Расчётное"}
        // unit="м²"
      />
      <ResultField
        label="Длина воздухораспределителя (L)"
        value={results.geometry["Длина воздухораспределителя"] || "Расчётное"}
        // unit="м"
      />
      <ResultField
        label="Высота слоя оросителя (hор)"
        value={results.geometry["Высота оросителя"] || "Расчётное"}
      />
      <ResultField
        label="Площадь окон градирни (Sок)"
        value={results.geometry["Площадь окон"] || "Расчётное"}
        // unit="м²"
      />
      <ResultField
        label="Диаметр вентилятора"
        value={results.geometry["Диаметр вентилятора"] || "Расчётное"}
        // unit="м"
      />
    </Section>
  );
};