import { useState } from 'react';
import { v1 } from 'uuid';
import { TaskType, Todolist } from './components/Todolist';

export type FilterValueType = 'all' | 'active' | 'complited';
export type TodolistsType = {
  id: string;
  title: string;
  filter: FilterValueType;
};
export type TasksStateType = {
  [key: string]: Array<TaskType>;
};

function App() {
  const todolistId1 = v1();
  const todolistId2 = v1();

  const [todolists, setTodolists] = useState<Array<TodolistsType>>([
    { id: todolistId1, title: 'What to learn', filter: 'all' },
    { id: todolistId2, title: 'What to buy', filter: 'all' },
  ]);

  const [tasks, setTasks] = useState<TasksStateType>({
    [todolistId1]: [
      { id: v1(), title: 'CSS', isDone: true },
      { id: v1(), title: 'JS', isDone: true },
    ],
    [todolistId2]: [
      { id: v1(), title: 'Milk', isDone: true },
      { id: v1(), title: 'JS Book', isDone: true },
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
    const newTask = { id: v1(), title: taskName, isDone: false };
    const todolistTask = tasks[todolistId];
    tasks[todolistId] = [newTask, ...todolistTask];
    setTasks({ ...tasks });
  };

  const changeFilter = (value: FilterValueType, todoId: string) => {
    const todolist = todolists.find((tl) => {
      return tl.id === todoId;
    });
    if (todolist) {
      todolist.filter = value;
      setTodolists([...todolists]);
    }
  };

  const changeTaskStatus = (taskId: string, newTaskStatus: boolean, todolistId: string) => {
    const todolistTask = tasks[todolistId];
    let task = todolistTask.find((t) => {
      return t.id === taskId;
    });
    if (task) {
      task.isDone = newTaskStatus;
      setTasks({ ...tasks });
    }
  };

  const removeTodolist = (todoId: string) => {
    setTodolists(todolists.filter((tl) => tl.id !== todoId));
    delete tasks[todoId];
    setTasks({ ...tasks });
  };

  return (
    <div className="App">
      {todolists.map((tl) => {
        let allTodolistTasks = tasks[tl.id];
        let tasksForTodolist = allTodolistTasks;

        if (tl.filter === 'active') {
          tasksForTodolist = allTodolistTasks.filter((t) => {
            return t.isDone === false;
          });
        }
        if (tl.filter === 'complited') {
          tasksForTodolist = allTodolistTasks.filter((t) => {
            return t.isDone === true;
          });
        }

        return (
          <Todolist
            todoId={tl.id}
            key={tl.id}
            title={tl.title}
            tasks={tasksForTodolist}
            removeTask={removeTask}
            changeFilter={changeFilter}
            addTask={addTask}
            changeTaskStatus={changeTaskStatus}
            filter={tl.filter}
            removeTodolist={removeTodolist}
          />
        );
      })}
    </div>
  );
}

export default App;
