import AddTaskCard from "@/components/addTaskCard";
import TaskCard from "@/components/taskDetail";
import dbConnect from "@/db/mongoose";
import Task from "@/models/Task";
import { TaskInterface } from "@/tsModels/taskInterface";
import { Masonry } from "@mui/lab";
import { Box, Button, Card, Grid, Paper, Typography } from "@mui/material";
import { useState } from "react";

interface TasksProps {
  tasks: TaskInterface[];
}

const Tasks = (props: TasksProps) => {
  const [isAddTaskModalOpen, setAddTaskModalOpen] = useState(false);

  const { tasks } = props;

  return (
    <div>
      <Paper sx={{ paddingLeft: 2 } }>
        <Grid container justifyContent={"center"} >
          <Card sx={{padding: 3, marginTop: 3}} variant="outlined">
          <Typography variant="h5">
            Next.js Tasks App
          </Typography>
          </Card>
        </Grid>
        <Button variant="contained" sx={{marginBottom: 4, marginTop: 2}} onClick={() => setAddTaskModalOpen(true)}>
          Create Task
        </Button>
        <Box sx={{ minHeight: 253 }}>
          <Masonry columns={{ xs: 1, sm: 2, md: 2, lg: 3, xl: 5 }} spacing={2}>
            {tasks &&
            tasks?.length > 0 &&
            tasks.map((task: TaskInterface) => (
              <TaskCard task={task} />
            ))}
          </Masonry>
        </Box>
      </Paper>
      {isAddTaskModalOpen && (
        <AddTaskCard
          isOpen={isAddTaskModalOpen}
          closeModal={() => setAddTaskModalOpen(false)}
        />
      )}
    </div>
  );
};



export default Tasks;

export const getServerSideProps = async () => {
  try {
    await dbConnect();

    console.log("FETCHING DOCUMENTS");
    const tasks = await Task.find({}).sort({ createdAt: "descending" });
    console.log("FETCHED DOCUMENTS");

    return {
      props: {
        tasks: JSON.parse(JSON.stringify(tasks)),
      },
    };
  } catch (error) {
    console.log(error);
    return {
      notFound: true,
    };
  }
};
