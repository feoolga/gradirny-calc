import { InputField } from "./InputField";
import { Section } from "./Section";
import { Form } from 'react-bootstrap';

export const ParametersOutdoorAirSection = ({ formik }) => (
    <Section title="Параметры наружного воздуха обеспеченность">
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
        <InputField
            label="Барометрическое давление (Pб)"
            name="airParameters.barometric_press" 
            formik={formik}
            unit="кПа"
        />
    </Section>
  );