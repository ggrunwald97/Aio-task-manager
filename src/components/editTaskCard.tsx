import FormikInputField from "@/shared-components/FormikField";
import { Task } from "@/shared-schemas/taskSchema";
import { TaskInterface } from "@/tsModels/taskInterface";
import {
  Paper,
  Checkbox,
  FormControlLabel,
  Button,
  Modal,
  Grid,
  Typography,
  Grow,
  Box,
  Stack,
} from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useState } from "react";

interface editTaskProps {
  isOpen: boolean;
  closeModal: Function;
  task: TaskInterface;
}

const EditTaskCard = (props: editTaskProps) => {
  const { isOpen, closeModal, task } = props;
  const [isSaveButtonEnabled, setIsSaveButtonEnabled] = useState(false);

  const initialValues = {
    title: task.title,
    completed: task.completed,
    description: task.description,
  };

  const checkIfIsValid = (value: any) =>
    Task.validate(value)
      .then(() => setIsSaveButtonEnabled(true))
      .catch(() => setIsSaveButtonEnabled(false));

  const formik = useFormik({
    initialValues,
    validationSchema: Task,
    validate: checkIfIsValid,
    onSubmit: () => {},
  });

  const router = useRouter();

  const handleSave = async () => {
    await fetch(`/api/tasks/?id=${task._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: formik.values.title,
        completed: formik.values.completed,
        description: formik.values.description,
      }),
    });
    router.replace(router.asPath);

    closeModal();
  };

  return (
    <Grid container spacing={2} minHeight={120}>
      <Grid xs={12} item justifyContent="center" alignItems="center">
        <Grow
          in={isOpen}
          style={{ transformOrigin: "0 0 0" }}
          {...(isOpen ? { timeout: 1000 } : {})}
        >
          <Box>
            <Modal sx={{}} open={isOpen} onClose={() => closeModal()}>
              <Paper sx={{ padding: 2 }}>
                <Typography variant="h4">{`Editing Task ${task._id}`}</Typography>
                <Stack spacing={1}>
                  <FormikInputField
                    id="title"
                    label="Title"
                    formik={formik}
                  />
                  <FormikInputField
                    id="description"
                    label="Description"
                    formik={formik}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        onClick={() => {
                          formik.setFieldValue(
                            "completed",
                            !formik.values.completed
                          );
                        }}
                        checked={formik.values.completed}
                      ></Checkbox>
                    }
                    label="Completed"
                  />
                </Stack>
                <Grid item sx={{ paddingBottom: 2, paddingTop: 2 }}>
                  <Button
                    variant="contained"
                    sx={{ marginRight: 2 }}
                    disabled={!isSaveButtonEnabled}
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                  <Button variant="outlined" onClick={() => closeModal()}>
                    Cancel
                  </Button>
                </Grid>
              </Paper>
            </Modal>
          </Box>
        </Grow>
      </Grid>
    </Grid>
  );
};

export default EditTaskCard;
