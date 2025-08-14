import { ResultField } from "./ResultField";
import { Section } from "./Section";

export const CalculationForParametersOutdoorAirSection = ({ results }) => {
  // Проверяем наличие данных и устанавливаем значения по умолчанию


  return (
    <Section title="Расход воды">
      <ResultField
        label="Потери на испарение (Gi)"
        value={results.waterLoss["Испарение"] ?? "Н/д"}
        // unit="м³/ч"
      />
      <ResultField
        label="Капельный унос (Gy)"
        value={results.waterLoss["Капельный унос"] ?? "Н/д"}
        // unit="м³/ч"
      />
      <ResultField
        label="Потери на продувку (Gп)"
        value={results.waterLoss["Продувка"] ?? "Расчётное"}
        // unit="м³/ч"
      />
      <ResultField
        label="Макс. расход подпиточной воды (Gd)"
        value={results.waterLoss["Общие потери"] ?? "Расчётное"}
        // unit="м³/ч"
      />
    </Section>
  );
};