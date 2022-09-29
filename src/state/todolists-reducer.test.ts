import {
  addTodoTC,
  changeTodolistFilterAC,
  ChangeTodolistFilterActionType,
  changeTodoTitleTC,
  FilterValueType,
  removeTodoTC,
  TodolistDomainType,
  todolistsReducer,
} from './todolists-reducer';
import { v1 } from 'uuid';
import { TodolistType } from '../api/todolist-api';

let todolistId1: string;
let todolistId2: string;

let startState: Array<TodolistDomainType>;

beforeEach(() => {
  todolistId1 = v1();
  todolistId2 = v1();

  startState = [
    { id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0, entityStatus: 'idle' },
    { id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0, entityStatus: 'idle' },
  ];
});

test('correct todolist should be removed', () => {
  const endState = todolistsReducer(
    startState,
    removeTodoTC.fulfilled({ todoId: todolistId1 }, 'requestId', { todoId: 'todolistId2' })
  );

  expect(endState.length).toBe(1);
  expect(endState[0].id).toBe(todolistId2);
});

test('correct todolist should be added', () => {
  let newTodolistTitle = 'New Todolist';

  const todo: TodolistType = {
    addedDate: '',
    id: '435fsdxg-dsf5',
    order: 1,
    title: newTodolistTitle,
  };

  const endState = todolistsReducer(startState, addTodoTC.fulfilled({ todo }, 'requestId', { title: todo.title }));

  expect(endState.length).toBe(3);
  expect(endState[0].title).toBe(newTodolistTitle);
});

test('correct todolist should change its name', () => {
  let newTodolistTitle = 'New Todolist';

  const endState = todolistsReducer(
    startState,
    changeTodoTitleTC.fulfilled({ todoId: todolistId2, title: newTodolistTitle }, 'requestId', {
      todoId: todolistId2,
      title: newTodolistTitle,
    })
  );

  expect(endState[0].title).toBe('What to learn');
  expect(endState[1].title).toBe(newTodolistTitle);
});

test('correct filter of todolist should be changed', () => {
  let newFilter: FilterValueType = 'completed';

  const action: ChangeTodolistFilterActionType = changeTodolistFilterAC({ todoId: todolistId2, filter: newFilter });

  const endState = todolistsReducer(startState, action);

  expect(endState[0].filter).toBe('all');
  expect(endState[1].filter).toBe(newFilter);
});
