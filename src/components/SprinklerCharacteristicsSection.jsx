import { InputField } from "./InputField";
import { Section } from "./Section";
import { SPRINKLER_TYPES } from '../utils/constants';


export const SprinklerCharacteristicsSection = ({ formik }) => {
  const handleSprinklerChange = async (e) => {
    const selectedType = e.target.value;
    await formik.setFieldValue('sprinklerName', selectedType);
    
    if (selectedType && SPRINKLER_TYPES[selectedType]) {
      const params = SPRINKLER_TYPES[selectedType];
      await formik.setValues({
        ...formik.values,
        sprinklerName: selectedType,
        sprinklerCharacteristics: {
          ...formik.values.sprinklerCharacteristics,
          a0: params.a0,
          m: params.m,
          hor: params.hor,
          kor: params.kor
        }
      }, true);
      
      await formik.validateForm();
    }
  };

  return (
    <Section title="Характеристики оросителя и параметры системы">
        <h6 className="text-center">Характеристики оросителя</h6>
        <div className="mb-3">
          <label className="form-label">Модель оросителя</label>
          <select
            className="form-select form-select-sm"
            value={formik.values.sprinklerName || ''}
            onChange={handleSprinklerChange}
          >
            <option value="">Выберите модель</option>
            {Object.keys(SPRINKLER_TYPES).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
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
    </Section>
  );
};