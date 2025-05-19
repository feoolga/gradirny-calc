import { InputField } from "./InputField";
import { Section } from "./Section";
import { Form } from 'react-bootstrap';

export const ParametersOutdoorAirSection = ({ formik }) => {
  // Рассчитываем температуру по влажному термометру
  const wetBulbTemp = formik.values.airParameters?.temperature_dry 
    ? (formik.values.airParameters.temperature_dry - (100 - formik.values.airParameters.humidity) / 5).toFixed(1)
    : "—";

  return (
    <Section title="Климатические условия">
      <div className="d-flex align-items-center gap-2 mb-2">
        <Form.Select 
          size="sm"
          style={{ width: '100px' }}
          value={formik.values.reliability || 0.95}
          onChange={(e) => formik.setFieldValue('reliability', parseFloat(e.target.value))}
        >
          <option value={0.95}>0.95</option>
          <option value={0.98}>0.98</option>
        </Form.Select>
        
        <span className="small text-muted">для</span>

        <input
          type="text"
          className="form-control form-control-sm"
          style={{ width: '150px', display: 'inline-block' }}
          value={formik.values.city || ''}
          onChange={(e) => formik.setFieldValue('city', e.target.value)}
          placeholder="Город"
        />
      </div>
      
      <InputField
        label="Температура по сухому термометру"
        name="airParameters.temperature_dry"
        formik={formik}
        unit="°C"
      />
      
      <InputField
        label="Относительная влажность воздуха (φ)"
        name="airParameters.humidity"
        formik={formik}
        unit="%"
      />
      
      {/* Новое поле - температура по влажному термометру (readonly) */}
      <div className="mb-3">
        <label className="form-label">
          Температура по влажному терм. (τ)
        </label>
        <input
          type="text"
          className="form-control form-control-sm ms-5"
          style={{ width: '100px', display: 'inline-block' }}
          value={wetBulbTemp}
          readOnly
          disabled
        />
        <span className="ms-2 small text-muted">°C</span>
      </div>
      
      <InputField
        label="Барометрическое давление (Pб)"
        name="airParameters.barometric_press" 
        formik={formik}
        unit="кПа"
      />
    </Section>
  );
};