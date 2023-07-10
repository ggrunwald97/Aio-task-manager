import * as yup from 'yup';

export const User = yup.object({
  email: yup.string()
    .min(1, 'Enter your email')
    .email()
    .required('Email is required'),
  age: yup.number(),
  name: yup.string()
    .min(1, 'Enter your name')
    .required('Name is required'),
  password: yup
    .string()
    .min(1, 'Enter your password')
    .required('Password is required')
});

// users also have 'avatar'
