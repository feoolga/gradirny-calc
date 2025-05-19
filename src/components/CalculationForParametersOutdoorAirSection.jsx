import { ResultField } from "./ResultField";
import { Section } from "./Section";

export const CalculationForParametersOutdoorAirSection = ({ results }) => {
  // Проверяем наличие данных и устанавливаем значения по умолчанию
  const temperatures = results?.temperatures || {};
  const waterLoss = results?.waterLoss || {};

  return (
    <Section title="Параметры наружного воздуха и расхода воды">
      <ResultField
        label="Температура по влажному термометру (τ)"
        value={results["Температура по влажному терм."] ?? "Расчётное"}
        unit="°C"
      />
      <ResultField
        label="Потери на испарение (Gi)"
        value={results["Испарение"] ?? "Н/д"}
        unit="м³/ч"
      />
      <ResultField
        label="Капельный унос (Gy)"
        value={results["Капельный унос"] ?? "Н/д"}
        unit="м³/ч"
      />
      <ResultField
        label="Потери на продувку (Gп)"
        value={results["Продувка"] ?? "Расчётное"}
        unit="м³/ч"
      />
      <ResultField
        label="Макс. расход подпиточной воды (Gd)"
        value={results["Общие потери"] ?? "Расчётное"}
        unit="м³/ч"
      />
    </Section>
  );
};