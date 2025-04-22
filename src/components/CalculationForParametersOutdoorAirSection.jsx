import { ResultField } from "./ResultField";
import { Section } from "./Section";

export const CalculationForParametersOutdoorAirSection = ({ formik, autoResults }) => (
  <Section title="Параметры наружного воздуха и расхода воды">
    <ResultField
      label="Температура по влажному термометру (τ)"
      value={autoResults.wetBulbTemp || "Расчётное"}
      unit="°C"
    />
    <ResultField
      label="Потери на испарение (Gi)"
      value={autoResults.gi}
      unit="м³/ч"
    />
    <ResultField
      label="Капельный унос (Gy)"
      value={autoResults.gy}
      unit="м³/ч"
    />
    <ResultField
      label="Потери на продувку (Gп)"
      value={autoResults.gp || "Расчётное"}
      unit="м³/ч"
    />
    <ResultField
      label="Макс. расход подпиточной воды (Gd)"
      value={autoResults.gd || "Расчётное"}
      unit="м³/ч"
    />
  </Section>
);