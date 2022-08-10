import { AppBar, Button, Container, Grid, IconButton, Paper, Toolbar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { v1 } from 'uuid';
import { AddItemForm } from '../components/AddItemForm';
import { Todolist } from '../components/Todolist/Todolist';
import { TaskStatuses, TaskPriorities } from '../api/task-api';
import { TasksStateType } from '../state/tasks-reducer';
import { TodolistDomainType, FilterValueType } from '../state/todolists-reducer';

function App() {
  const todolistId1 = v1();
  const todolistId2 = v1();

  const [todolists, setTodolists] = useState<Array<TodolistDomainType>>([
    { id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0 },
    { id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0 },
  ]);

  const [tasks, setTasks] = useState<TasksStateType>({
    [todolistId1]: [
      {
        id: v1(),
        title: 'CSS',
        status: TaskStatuses.Completed,
        todoListId: todolistId1,
        addedDate: '',
        deadline: '',
        startDate: '',
        order: 0,
        priority: TaskPriorities.Low,
        description: '',
      },
      {
        id: v1(),
        title: 'JS',
        status: TaskStatuses.New,
        todoListId: todolistId1,
        addedDate: '',
        deadline: '',
        startDate: '',
        order: 0,
        priority: TaskPriorities.Low,
        description: '',
      },
    ],
    [todolistId2]: [
      {
        id: v1(),
        title: 'Milk',
        status: TaskStatuses.New,
        todoListId: todolistId2,
        addedDate: '',
        deadline: '',
        startDate: '',
        order: 0,
        priority: TaskPriorities.Low,
        description: '',
      },
      {
        id: v1(),
        title: 'JS Book',
        status: TaskStatuses.Completed,
        todoListId: todolistId2,
        addedDate: '',
        deadline: '',
        startDate: '',
        order: 0,
        priority: TaskPriorities.Low,
        description: '',
      },
    ],
  });

  const removeTask = (taskId: string, todolistId: string) => {
    const todolistTask = tasks[todolistId];
    tasks[todolistId] = todolistTask.filter((t) => {
      return t.id !== taskId;
    });
    setTasks({ ...tasks });
  };

  const addTask = (taskName: string, todolistId: string) => {
    const newTask = {
      id: v1(),
      title: taskName,
      status: TaskStatuses.New,
      todoListId: todolistId,
      addedDate: '',
      deadline: '',
      startDate: '',
      order: 0,
      priority: TaskPriorities.Low,
      description: '',
    };
    const todolistTask = tasks[todolistId];
    tasks[todolistId] = [newTask, ...todolistTask];
    setTasks({ ...tasks });
  };

  const changeTaskStatus = (taskId: string, status: TaskStatuses, todolistId: string) => {
    const todolistTask = tasks[todolistId];
    let task = todolistTask.find((t) => {
      return t.id === taskId;
    });
    if (task) {
      task.status = status;
      setTasks({ ...tasks });
    }
  };

  const changeTaskTitle = (newTitle: string, todolistId: string, taskId: string) => {
    const todolistTask = tasks[todolistId];
    const task = todolistTask.find((t) => t.id === taskId);
    if (task) {
      task.title = newTitle;
      setTasks({ ...tasks });
    }
  };

  const changeTodoFilter = (todoId: string, value: FilterValueType) => {
    const todolist = todolists.find((tl) => {
      return tl.id === todoId;
    });
    if (todolist) {
      todolist.filter = value;
      setTodolists([...todolists]);
    }
  };

  const changeTodoTitle = (newTitle: string, todoId: string) => {
    const todolist = todolists.find((t) => t.id === todoId);
    if (todolist) {
      todolist.title = newTitle;
      setTodolists([...todolists]);
    }
  };

  const removeTodolist = (todoId: string) => {
    setTodolists(todolists.filter((tl) => tl.id !== todoId));
    delete tasks[todoId];
    setTasks({ ...tasks });
  };

  const addTodolist = (title: string) => {
    const newTodoId = v1();
    const newTodo: TodolistDomainType = { id: newTodoId, title: title, filter: 'all', addedDate: '', order: 0 };
    setTodolists([newTodo, ...todolists]);
    setTasks({
      [newTodoId]: [],
      ...tasks,
    });
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
                return t.status === TaskStatuses.New;
              });
            }
            if (tl.filter === 'completed') {
              tasksForTodolist = allTodolistTasks.filter((t) => {
                return t.status === TaskStatuses.Completed;
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

export default App;
