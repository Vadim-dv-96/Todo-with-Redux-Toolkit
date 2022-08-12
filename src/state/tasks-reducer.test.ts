import { addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer, TasksStateType } from './tasks-reducer';
import { addTodolistAC, removeTodolistAC } from './todolists-reducer';
import { TaskPriorities, TaskStatuses } from '../api/task-api';

let startState: TasksStateType;

beforeEach(() => {
  startState = {
    todolistId1: [
      {
        id: '1',
        title: 'CSS',
        status: TaskStatuses.New,
        todoListId: 'todolistId1',
        addedDate: '',
        deadline: '',
        startDate: '',
        order: 0,
        priority: TaskPriorities.Low,
        description: '',
      },

      {
        id: '2',
        title: 'JS',
        status: TaskStatuses.Completed,
        todoListId: 'todolistId1',
        addedDate: '',
        deadline: '',
        startDate: '',
        order: 0,
        priority: TaskPriorities.Low,
        description: '',
      },

      {
        id: '3',
        title: 'React',
        status: TaskStatuses.New,
        todoListId: 'todolistId1',
        addedDate: '',
        deadline: '',
        startDate: '',
        order: 0,
        priority: TaskPriorities.Low,
        description: '',
      },
    ],
    todolistId2: [
      {
        id: '1',
        title: 'bread',
        status: TaskStatuses.New,
        todoListId: 'todolistId2',
        addedDate: '',
        deadline: '',
        startDate: '',
        order: 0,
        priority: TaskPriorities.Low,
        description: '',
      },

      {
        id: '2',
        title: 'milk',
        status: TaskStatuses.Completed,
        todoListId: 'todolistId2',
        addedDate: '',
        deadline: '',
        startDate: '',
        order: 0,
        priority: TaskPriorities.Low,
        description: '',
      },

      {
        id: '3',
        title: 'tea',
        status: TaskStatuses.New,
        todoListId: 'todolistId2',
        addedDate: '',
        deadline: '',
        startDate: '',
        order: 0,
        priority: TaskPriorities.Low,
        description: '',
      },
    ],
  };
});

test('correct task should be deleted from correct array', () => {
  const action = removeTaskAC('todolistId2', '2');

  const endState = tasksReducer(startState, action);

  expect(endState).toEqual({
    todolistId1: [
      {
        id: '1',
        title: 'CSS',
        status: TaskStatuses.New,
        todoListId: 'todolistId1',
        addedDate: '',
        deadline: '',
        startDate: '',
        order: 0,
        priority: TaskPriorities.Low,
        description: '',
      },
      {
        id: '2',
        title: 'JS',
        status: TaskStatuses.Completed,
        todoListId: 'todolistId1',
        addedDate: '',
        deadline: '',
        startDate: '',
        order: 0,
        priority: TaskPriorities.Low,
        description: '',
      },
      {
        id: '3',
        title: 'React',
        status: TaskStatuses.New,
        todoListId: 'todolistId1',
        addedDate: '',
        deadline: '',
        startDate: '',
        order: 0,
        priority: TaskPriorities.Low,
        description: '',
      },
    ],
    todolistId2: [
      {
        id: '1',
        title: 'bread',
        status: TaskStatuses.New,
        todoListId: 'todolistId2',
        addedDate: '',
        deadline: '',
        startDate: '',
        order: 0,
        priority: TaskPriorities.Low,
        description: '',
      },
      {
        id: '3',
        title: 'tea',
        status: TaskStatuses.New,
        todoListId: 'todolistId2',
        addedDate: '',
        deadline: '',
        startDate: '',
        order: 0,
        priority: TaskPriorities.Low,
        description: '',
      },
    ],
  });
});

test('correct task should be added to correct array', () => {
  const newTask = {
    id: '3',
    title: 'juce',
    status: TaskStatuses.New,
    todoListId: 'todolistId2',
    addedDate: '',
    deadline: '',
    startDate: '',
    order: 0,
    priority: TaskPriorities.Low,
    description: '',
  };
  const action = addTaskAC(newTask);

  const endState = tasksReducer(startState, action);

  expect(endState['todolistId1'].length).toBe(3);
  expect(endState['todolistId2'].length).toBe(4);
  expect(endState['todolistId2'][0].id).toBeDefined();
  expect(endState['todolistId2'][0].title).toBe('juce');
  expect(endState['todolistId2'][0].status).toBe(TaskStatuses.New);
});

test('status of specified task should be changed', () => {
  const action = changeTaskStatusAC('2', TaskStatuses.New, 'todolistId2');

  const endState = tasksReducer(startState, action);

  expect(endState['todolistId2'][1].status).toBe(TaskStatuses.New);
});

test('task title should be changed', () => {
  const action = changeTaskTitleAC('todolistId1', '1', 'xxx');

  const endState = tasksReducer(startState, action);

  expect(endState['todolistId1'][0].title).toBe('xxx');
});

test('new array should be added when new todolist is added', () => {
  const action = addTodolistAC('new todolist');

  const endState = tasksReducer(startState, action);

  const keys = Object.keys(endState);
  const newKey = keys.find((k) => k != 'todolistId1' && k != 'todolistId2');
  if (!newKey) {
    throw Error('new key should be added');
  }

  expect(keys.length).toBe(3);
  expect(endState[newKey]).toEqual([]);
});

test('property with todolistId should be deleted', () => {
  const action = removeTodolistAC('todolistId2');

  const endState = tasksReducer(startState, action);

  const keys = Object.keys(endState);

  expect(keys.length).toBe(1);
  expect(endState['todolistId2']).not.toBeDefined();
});
