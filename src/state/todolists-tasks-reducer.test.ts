import { TodolistType } from '../api/todolist-api';
import { tasksReducer, TasksStateType } from './tasks-reducer';
import { addTodoTC, TodolistDomainType, todolistsReducer } from './todolists-reducer';

test('ids should be equals', () => {
  const startTasksState: TasksStateType = {};
  const startTodolistsState: Array<TodolistDomainType> = [];

  const todo: TodolistType = {
    addedDate: '',
    id: '435fsdxg-dsf5',
    order: 1,
    title: 'new todolist',
  };

  const action = addTodoTC.fulfilled({ todo }, 'requestId', { title: todo.title });

  const endTasksState = tasksReducer(startTasksState, action);
  const endTodolistsState = todolistsReducer(startTodolistsState, action);

  const keys = Object.keys(endTasksState);
  const idFromTasks = keys[0];
  const idFromTodolists = endTodolistsState[0].id;

  expect(idFromTasks).toBe(action.payload.todo.id);
  expect(idFromTodolists).toBe(action.payload.todo.id);
});
