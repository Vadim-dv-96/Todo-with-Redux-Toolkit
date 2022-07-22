import { AppBar, Button, Container, Grid, IconButton, Paper, Toolbar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { AddItemForm } from './components/AddItemForm';
import { TaskType, Todolist } from './components/Todolist';
import { addTodolistAC, changeTodolistFilterAC, changeTodolistTitleAC, removeTodolistAC } from './state/todolists-reducer';
import { addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC } from './state/tasks-reducer';
import { useSelector } from 'react-redux';
import { AppRootStateType } from './state/store';
import { useDispatch } from 'react-redux';

export type FilterValueType = 'all' | 'active' | 'completed';
export type TodolistType = {
  id: string;
  title: string;
  filter: FilterValueType;
};
export type TasksStateType = {
  [todolistId: string]: Array<TaskType>;
};

function AppWithRedux() {
  const todolists = useSelector<AppRootStateType, Array<TodolistType>>((state) => state.todolists);
  const tasks = useSelector<AppRootStateType, TasksStateType>((state) => state.tasks);

  const dispatch = useDispatch();

  const removeTask = (todoId: string, taskId: string) => {
    dispatch(removeTaskAC(todoId, taskId));
  };

  const addTask = (taskName: string, todoId: string) => {
    dispatch(addTaskAC(taskName, todoId));
  };

  const changeTaskStatus = (taskId: string, newTaskStatus: boolean, todoId: string) => {
    dispatch(changeTaskStatusAC(taskId, newTaskStatus, todoId));
  };

  const changeTaskTitle = (todoId: string, taskId: string, newTitle: string) => {
    dispatch(changeTaskTitleAC(todoId, taskId, newTitle));
  };

  const changeTodoFilter = (todoId: string, value: FilterValueType) => {
    dispatch(changeTodolistFilterAC(todoId, value));
  };

  const changeTodoTitle = (todoId: string, newTitle: string) => {
    dispatch(changeTodolistTitleAC(todoId, newTitle));
  };

  const removeTodolist = (todoId: string) => {
    const action = removeTodolistAC(todoId); //создане переменной,что бы не создавать 2 обьекта ActionCreate
    dispatch(action);
  };

  const addTodolist = (title: string) => {
    const action = addTodolistAC(title); //делаем переменную action для одинаковой todoId в оба редьюсера
    dispatch(action);
  };

  return (
    <div className="App">
      <AppBar color="inherit" position="static">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>

      <Container fixed>
        <Grid style={{ padding: '20px' }}>
          <AddItemForm addItem={addTodolist} />
        </Grid>

        <Grid container spacing={5}>
          {todolists.map((tl) => {
            let allTodolistTasks = tasks[tl.id];
            let tasksForTodolist = allTodolistTasks;

            if (tl.filter === 'active') {
              tasksForTodolist = allTodolistTasks.filter((t) => {
                return t.isDone === false;
              });
            }
            if (tl.filter === 'completed') {
              tasksForTodolist = allTodolistTasks.filter((t) => {
                return t.isDone === true;
              });
            }

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
      </Container>
    </div>
  );
}

export default AppWithRedux;
