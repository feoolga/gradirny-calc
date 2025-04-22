import { ResultField } from "./ResultField";
import { Section } from "./Section";

export const CalculationForInitialDataSection = ({ formik, autoResults }) => (
  <Section title="Расчётные параметры по исходным данным">
    <ResultField
      label="Производительность секции (Gж)"
      value={autoResults.gg}
      unit="м³/ч"
    />
    <ResultField
      label="Плотность орошения (qж)"
      value={autoResults.gx}
      unit="м³/м²·ч"
    />
    <ResultField
      label="Мощность теплосъема (Q)"
      value={autoResults.q}
      unit="МВт"
    />
    <ResultField
      label="Соотношение воздуха и воды (λ)"
      value={autoResults.lambda || "Расчётное"} // Добавлено новое поле
      unit="≥600"
    />
  </Section>
);