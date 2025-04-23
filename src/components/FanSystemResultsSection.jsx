import { ResultField } from "./ResultField";
import { Section } from "./Section";

export const FanSystemResultsSection = ({ formik, autoResults }) => (
  <Section title="Параметры вентиляторной установки">
        <ResultField
          label="Статический напор (Pс)"
          value={autoResults.staticPressure || "Расчётное"}
          unit="Па"
        />
        <ResultField
          label="Динамический напор (Pдин)"
          value={autoResults.dynamicPressure || "Расчётное"}
          unit="Па"
        />
        <ResultField
          label="Полный напор (Pпол)"
          value={autoResults.totalPressure || "Расчётное"}
          unit="Па"
        />
        <ResultField
          label="Производительность (Gв)"
          value={autoResults.fanPerformance || "Расчётное"}
          unit="м³/ч"
        />
        <ResultField
          label="Скорость воздуха в вентиляторе (wвен)"
          value={autoResults.airSpeedFan || "Расчётное"}
          unit="м/с"
        />
        <ResultField
          label="Скорость воздуха в градирне (wгр)"
          value={autoResults.airSpeedTower || "Расчётное"}
          unit="м/с"
        />
        <ResultField
          label="Потребляемая мощность (N₀)"
          value={autoResults.powerConsumption || "Расчётное"}
          unit="кВт"
        />
        <ResultField
          label="Минимальная мощность привода (N)"
          value={autoResults.minDrivePower || "Расчётное"}
          unit="кВт"
        />
        <ResultField
          label="Суммарное сопротивление (z)"
          value={autoResults.totalResistance || "Расчётное"}
          unit=""
        />
  </Section>
);