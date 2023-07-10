import { TaskInterface } from "@/tsModels/taskInterface";
import {
  Button,
  Card,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import EditTaskCard from "./editTaskCard";

interface TaskCardProps {
  task: TaskInterface;
}

const TaskDetail = (props: TaskCardProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { task } = props;
  const router = useRouter();

  const handleSave = async (completed: boolean) => {
    await fetch(`/api/tasks/?id=${task._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        completed: completed
      }),
    });
    router.replace(router.asPath);
  }

  const handleDelete = async () => {
    await fetch(`/api/tasks/?id=${task._id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    router.replace(router.asPath);
  }

  return (
    <>
      <Card
        key={task._id}
        sx={{padding: 1}}
        elevation={4}
      >
        <Grid container>
          <Stack>
            <Grid item sx={{ padding: 2 }}>
              <Typography color="darkgray" fontWeight={400} fontSize={11}>
                {task._id}
              </Typography>
            </Grid>
            {task.title && (
              <Grid item sx={{ padding: 2 }}>
                <Typography color="lightgray" fontWeight={800} fontSize={11}>
                  Title
                </Typography>
                <Typography>
                  {task.title}
                </Typography>
              </Grid>
            )}
            {task.title && (
              <Divider sx={{marginLeft: 2, marginRight: 2}} />
            )}
            {task.description && (
              <Grid item sx={{ padding: 2 }}>
                <Typography color="lightgray" fontWeight={800} fontSize={11}>
                  Description
                </Typography>
                <Typography>
                  {task.description}
                </Typography>
              </Grid>
            )}
            {task.description && (
              <Divider sx={{marginLeft: 2, marginRight: 2}} />
            )}
            <Grid item sx={{ padding: 2 }}>
              <FormControlLabel
                control={<Checkbox onClick={() => handleSave(!task.completed)} checked={task.completed}></Checkbox>}
                label="Completed"
              />
            </Grid>
          </Stack>
        </Grid>
        <Grid container justifyContent={"flex-end"}>
          <Stack spacing={1} direction="row">
            <Button
              sx={{ backgroundColor: '#db2b1f' }}
              variant="contained"
              onClick={() => handleDelete()}
            >
              Delete
            </Button>
            <Button
              sx={{}}
              variant="contained"
              onClick={() => setIsEditModalOpen(true)}
            >
              Edit
            </Button>
          </Stack>
        </Grid>
      </Card>
      {isEditModalOpen && (
        <EditTaskCard
          isOpen={isEditModalOpen}
          closeModal={() => setIsEditModalOpen(false)}
          task={task}
        />
      )}
    </>
  );
};

export default TaskDetail;
