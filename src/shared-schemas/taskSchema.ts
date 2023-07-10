import * as yup from 'yup';

export const Task = yup.object({
  description: yup.string(),
  title: yup.string()
    .min(1)
    .required('Title is required'),
  completed: yup
    .boolean()
    .required('Completed is required')
});

