import { FormikShape } from "@/tsModels/FormikShape";
import { TextField } from "@mui/material";


interface FormikInputFieldProps {
  id: string,
  label: string,
  formik: FormikShape,
}

export const FormikInputField = (props: FormikInputFieldProps) => {

  const  { id, label, formik } = props;

  const fieldId = id.toString();

  return (
    <TextField
      fullWidth
      id={id}
      name={id}
      inputProps={{ maxLength: 1000 }}
      label={label}
      value={formik.values[fieldId]}
      onChange={formik.handleChange}
      error={formik.touched[fieldId] && Boolean(formik.errors[fieldId])}
      helperText={formik.touched[fieldId] && <>{formik.errors[fieldId]}</>}
      onBlur={formik.handleBlur}
    />
  )
}

export default FormikInputField;
