import { InputField } from "./InputField";
import { Section } from "./Section";

export const TowerParametersSection = ({ formik }) => (
    <Section title="Параметры градирни">
        <InputField
            label="Ширина секции градирни (a)"
            name="towerParameters.width"
            formik={formik}
            unit="м"
        />
        <InputField
            label="Длина секции градирни (b)"
            name="towerParameters.length"
            formik={formik}
            unit="м"
        />
        <InputField
            label="Диаметр вентилятора (d)"
            name="towerParameters.fanDiameter"
            formik={formik}
            unit="м"
        />
        <InputField
            label="Высота окон градирни (Hок)"
            name="towerParameters.windowHeight"
            formik={formik}
            unit="м"
        />
    </Section>
);