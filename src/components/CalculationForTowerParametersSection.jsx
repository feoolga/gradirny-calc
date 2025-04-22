import { ResultField } from "./ResultField";
import { Section } from "./Section";

export const CalculationForTowerParametersSection = ({ formik, autoResults }) => (
  <Section title="Расчётные параметры градирни">
    <ResultField
      label="Площадь орошения секции (fор)"
      value={autoResults.towerArea || "Расчётное"}
      unit="м²"
    />
    <ResultField
      label="Длина воздухораспределителя (L)"
      value={autoResults.airDistributorLength || "Расчётное"}
      unit="м"
    />
    <ResultField
      label="Площадь окон градирни (Sок)"
      value={autoResults.windowArea || "Расчётное"}
      unit="м²"
    />
  </Section>
);