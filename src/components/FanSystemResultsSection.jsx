import { ResultField } from "./ResultField";
import { Section } from "./Section";

export const FanSystemResultsSection = ({ results }) => {
  // Проверяем наличие данных и устанавливаем fallback-значения
  const fanSystem = results?.fanSystem || {};

  return (
    <Section title="Параметры вентиляторной установки">
      <ResultField
        label="Статический напор (Pс)"
        value={results["Статическое давление"] ?? "Расчётное"}
        // unit="Па"
      />
      <ResultField
        label="Динамический напор (Pдин)"
        value={results["Динамическое давление"] ?? "Расчётное"}
        // unit="Па"
      />
      <ResultField
        label="Полный напор (Pпол)"
        value={results["Полное давление"] ?? "Расчётное"}
        // unit="Па"
      />
      <ResultField
        label="Производительность (Gв)"
        value={results["Производительность вентилятора"] ?? "Расчётное"}
        // unit="м³/ч"
      />
      <ResultField
        label="Скорость воздуха в вентиляторе (wвен)"
        value={results["Скорость в вентиляторе"] ?? "Расчётное"}
        // unit="м/с"
      />
      <ResultField
        label="Скорость воздуха в градирне (wгр)"
        value={results["Скорость воздуха в градирне"] ?? "Расчётное"}
        // unit="м/с"
      />
      <ResultField
        label="Потребляемая мощность (N₀)"
        value={results["Потребляемая мощность"] ?? "Расчётное"}
        // unit="кВт"
      />
      <ResultField
        label="Минимальная мощность привода (N)"
        value={results["Мощность привода"] ?? "Расчётное"}
        // unit="кВт"
      />
      <ResultField
        label="Суммарное сопротивление (z)"
        value={results["Суммарное сопротивление"] ?? "Расчётное"}
        // unit=""
      />
    </Section>
  );
};