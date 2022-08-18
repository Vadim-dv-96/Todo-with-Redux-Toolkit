import { Grid, Paper } from '@mui/material';
import { useCallback, useEffect } from 'react';
import { TaskStatuses } from '../../api/task-api';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { deleteTaskTC, addTaskTC, updateTaskTC } from '../../state/tasks-reducer';
import { FilterValueType, changeTodolistFilterAC, getTodosTC, addTodoTC, removeTodoTC, changeTodoTitleTC } from '../../state/todolists-reducer';
import { AddItemForm } from '../AddItemForm';
import { Todolist } from '../Todolist/Todolist';

type TodolistListPropsType = { demo?: boolean };

export const TodolistList: React.FC<TodolistListPropsType> = ({ demo = false }) => {
  // типизированый хук useAppSelector
  const todolists = useAppSelector((state) => state.todolists);
  const tasks = useAppSelector((state) => state.tasks);
  // типизированый хук useAppDispatch
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!demo) {
      dispatch(getTodosTC());
    }
  }, [dispatch]);

  const removeTask = useCallback(
    (todoId: string, taskId: string) => {
      dispatch(deleteTaskTC(todoId, taskId));
    },
    [dispatch]
  );

  const addTask = useCallback(
    (taskName: string, todoId: string) => {
      dispatch(addTaskTC(todoId, taskName));
    },
    [dispatch]
  );

  const changeTaskStatus = useCallback(
    (taskId: string, status: TaskStatuses, todoId: string) => {
      dispatch(updateTaskTC(todoId, taskId, { status }));
    },
    [dispatch]
  );

  const changeTaskTitle = useCallback(
    (todoId: string, taskId: string, newTitle: string) => {
      dispatch(updateTaskTC(todoId, taskId, { title: newTitle }));
    },
    [dispatch]
  );

  const changeTodoFilter = useCallback(
    (todoId: string, value: FilterValueType) => {
      dispatch(changeTodolistFilterAC(todoId, value));
    },
    [dispatch]
  );

  const changeTodoTitle = useCallback(
    (todoId: string, newTitle: string) => {
      dispatch(changeTodoTitleTC(todoId, newTitle));
    },
    [dispatch]
  );

  const removeTodolist = useCallback(
    (todoId: string) => {
      // const action = removeTodoTC(todoId); //создане переменной,что бы не создавать 2 обьекта ActionCreate
      dispatch(removeTodoTC(todoId));
    },
    [dispatch]
  );

  const addTodolist = useCallback(
    (title: string) => {
      // const action = addTodoTC(title); //делаем переменную action для одинаковой todoId в оба редьюсера
      dispatch(addTodoTC(title));
    },
    [dispatch]
  );
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
