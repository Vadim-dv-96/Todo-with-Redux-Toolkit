import { Grid, Paper } from '@mui/material';
import { useCallback, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { TaskStatuses } from '../../api/task-api';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { deleteTaskTC, addTaskTC, updateTaskTC } from '../../state/tasks-reducer';
import {
  FilterValueType,
  changeTodolistFilterAC,
  getTodosTC,
  addTodoTC,
  removeTodoTC,
  changeTodoTitleTC,
} from '../../state/todolists-reducer';
import { AddItemForm } from '../AddItemForm';
import { Todolist } from '../Todolist/Todolist';

type TodolistListPropsType = { demo?: boolean };

export const TodolistList: React.FC<TodolistListPropsType> = ({ demo = false }) => {
  // типизированый хук useAppSelector
  const todolists = useAppSelector((state) => state.todolists);
  const tasks = useAppSelector((state) => state.tasks);
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  // типизированый хук useAppDispatch
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!demo && isLoggedIn) {
      dispatch(getTodosTC());
    }
  }, [dispatch]);

  const removeTask = useCallback(
    (todoId: string, taskId: string) => {
      dispatch(deleteTaskTC({ todoId: todoId, taskId: taskId }));
    },
    [dispatch]
  );

  const addTask = useCallback(
    (taskName: string, todoId: string) => {
      dispatch(addTaskTC({ todoId: todoId, title: taskName }));
    },
    [dispatch]
  );

  const changeTaskStatus = useCallback(
    (taskId: string, status: TaskStatuses, todoId: string) => {
      dispatch(updateTaskTC({ todoId: todoId, taskId: taskId, domainModel: { status } }));
    },
    [dispatch]
  );

  const changeTaskTitle = useCallback(
    (todoId: string, taskId: string, newTitle: string) => {
      dispatch(updateTaskTC({ todoId: todoId, taskId: taskId, domainModel: { title: newTitle } }));
    },
    [dispatch]
  );

  const changeTodoFilter = useCallback(
    (todoId: string, value: FilterValueType) => {
      dispatch(changeTodolistFilterAC({ todoId: todoId, filter: value }));
    },
    [dispatch]
  );

  const changeTodoTitle = useCallback(
    (todoId: string, newTitle: string) => {
      dispatch(changeTodoTitleTC({ todoId, title: newTitle }));
    },
    [dispatch]
  );

  const removeTodolist = useCallback(
    (todoId: string) => {
      dispatch(removeTodoTC({ todoId }));
    },
    [dispatch]
  );

  const addTodolist = useCallback(
    (title: string) => {
      dispatch(addTodoTC({ title }));
    },
    [dispatch]
  );

  if (!isLoggedIn) {
    return <Navigate to={'login'} />;
  }

  return (
    <>
      <Grid style={{ padding: '20px' }}>
        <AddItemForm addItem={addTodolist} />
      </Grid>

      <Grid container spacing={5}>
        {todolists.map((tl) => {
          let allTodolistTasks = tasks[tl.id];
          let tasksForTodolist = allTodolistTasks;
          return (
            <Grid item key={tl.id}>
              <Paper style={{ padding: '20px' }}>
                <Todolist
                  todo={tl}
                  tasks={tasksForTodolist}
                  removeTask={removeTask}
                  changeTodoFilter={changeTodoFilter}
                  addTask={addTask}
                  changeTaskStatus={changeTaskStatus}
                  changeTaskTitle={changeTaskTitle}
                  removeTodolist={removeTodolist}
                  changeTodoTitle={changeTodoTitle}
                  demo={demo}
                />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
