import { InputField } from "./InputField";
import { Section } from "./Section";

export const SprinklerCharacteristicsSection = ({ formik }) => (
  <Section title="Характеристики оросителя и параметры системы">
    {/* <div className="row">
      <div className="col"> */}
        <h6 className="text-center">Характеристики оросителя</h6>
        <InputField
          label="A₀ (коэффициент оросителя)"
          name="sprinklerCharacteristics.a0"
          formik={formik}
          unit="1/м"
        />
        <InputField
          label="m (показатель степени)"
          name="sprinklerCharacteristics.m"
          formik={formik}
          unit=""
        />
        <InputField
          label="Kор (коэффициент орошения)"
          name="sprinklerCharacteristics.kor"
          formik={formik}
          unit="м·ч/м³"
        />
      {/* </div>
      
      <div className="col"> */}
        <h6 className="text-center">Коэффициенты сопротивления</h6>
        <InputField
          label="Оросителя (zсо)"
          name="resistanceCoefficients.zso"
          formik={formik}
          unit=""
        />
        <InputField
          label="Водоуловителя (zву)"
          name="resistanceCoefficients.zvu"
          formik={formik}
          unit=""
        />
        <InputField
          label="Окон (zок)"
          name="resistanceCoefficients.zok"
          formik={formik}
          unit=""
        />
      {/* </div>
      
      <div className="col"> */}
        <h6 className="text-center">КПД системы</h6>
        <InputField
          label="Рабочего колеса (ηк)"
          name="efficiency.etaK"
          formik={formik}
          unit=""
        />
        <InputField
          label="Привода (ηп)"
          name="efficiency.etaP"
          formik={formik}
          unit=""
        />
        <InputField
          label="Высота слоя оросителя (hор)"
          name="sprinklerCharacteristics.hor"
          formik={formik}
          unit="м"
        />
      {/* </div>
    </div> */}
  </Section>
);