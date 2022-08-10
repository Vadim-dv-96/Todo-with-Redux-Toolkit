import { Grid, Paper } from '@mui/material';
import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TaskStatuses } from '../../api/task-api';
import { AppRootStateType } from '../../state/store';
import { TasksStateType, removeTaskAC, addTaskAC, changeTaskStatusAC, changeTaskTitleAC } from '../../state/tasks-reducer';
import { TodolistDomainType, FilterValueType, changeTodolistFilterAC, changeTodolistTitleAC, removeTodolistAC, addTodolistAC } from '../../state/todolists-reducer';
import { AddItemForm } from '../AddItemForm';
import { Todolist } from '../Todolist/Todolist';

export function TodolistList() {
  const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>((state) => state.todolists);
  const tasks = useSelector<AppRootStateType, TasksStateType>((state) => state.tasks);

  const dispatch = useDispatch();

  const removeTask = useCallback(
    (todoId: string, taskId: string) => {
      dispatch(removeTaskAC(todoId, taskId));
    },
    [dispatch]
  );

  const addTask = useCallback(
    (taskName: string, todoId: string) => {
      dispatch(addTaskAC(taskName, todoId));
    },
    [dispatch]
  );

  const changeTaskStatus = useCallback(
    (taskId: string, status: TaskStatuses, todoId: string) => {
      dispatch(changeTaskStatusAC(taskId, status, todoId));
    },
    [dispatch]
  );

  const changeTaskTitle = useCallback(
    (todoId: string, taskId: string, newTitle: string) => {
      dispatch(changeTaskTitleAC(todoId, taskId, newTitle));
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
      dispatch(changeTodolistTitleAC(todoId, newTitle));
    },
    [dispatch]
  );

  const removeTodolist = useCallback(
    (todoId: string) => {
      const action = removeTodolistAC(todoId); //создане переменной,что бы не создавать 2 обьекта ActionCreate
      dispatch(action);
    },
    [dispatch]
  );

  const addTodolist = useCallback(
    (title: string) => {
      const action = addTodolistAC(title); //делаем переменную action для одинаковой todoId в оба редьюсера
      dispatch(action);
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
                  todoId={tl.id}
                  title={tl.title}
                  tasks={tasksForTodolist}
                  removeTask={removeTask}
                  changeTodoFilter={changeTodoFilter}
                  addTask={addTask}
                  changeTaskStatus={changeTaskStatus}
                  changeTaskTitle={changeTaskTitle}
                  filter={tl.filter}
                  removeTodolist={removeTodolist}
                  changeTodoTitle={changeTodoTitle}
                />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
}
