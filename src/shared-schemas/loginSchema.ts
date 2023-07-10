import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup
    .string()
    .min(1, 'Enter your email')
    .email()
    .required('Email is required'),
  password: yup
    .string()
    .min(1, 'Enter your password')
    .required('Password is required')
});
