import {
  addTaskTC,
  deleteTaskTC,
  getTasksTC,
  tasksReducer,
  TasksStateType,
  UpdateDomainTaskModelType,
  updateTaskTC,
} from './tasks-reducer';
import { addTodoTC, removeTodoTC } from './todolists-reducer';
import { TaskPriorities, TaskStatuses } from '../api/task-api';
import { TodolistType } from '../api/todolist-api';

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
        entityTaskStatus: 'idle',
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
        entityTaskStatus: 'idle',
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
        entityTaskStatus: 'idle',
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
        entityTaskStatus: 'idle',
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
        entityTaskStatus: 'idle',
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
        entityTaskStatus: 'idle',
      },
    ],
  };
});

test('tasks should be added for todo', () => {
  const action = getTasksTC.fulfilled(
    { tasks: startState['todolistId1'], todoId: 'todolistId1' },
    'requestId',
    'todolistId1'
  );

  const endState = tasksReducer(
    {
      todolistId2: [],
      todolistId1: [],
    },
    action
  );

  expect(endState['todolistId1'].length).toBe(3);
  expect(endState['todolistId2'].length).toBe(0);
});

test('correct task should be deleted from correct array', () => {
  const action = deleteTaskTC.fulfilled({ todoId: 'todolistId2', taskId: '2' }, 'requestId', {
    todoId: 'todolistId2',
    taskId: '2',
  });

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
        entityTaskStatus: 'idle',
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
        entityTaskStatus: 'idle',
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
        entityTaskStatus: 'idle',
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
        entityTaskStatus: 'idle',
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
        entityTaskStatus: 'idle',
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
    entityTaskStatus: 'idle',
  };
  const action = addTaskTC.fulfilled(newTask, 'requestId', { todoId: newTask.todoListId, title: newTask.title });

  const endState = tasksReducer(startState, action);

  expect(endState['todolistId1'].length).toBe(3);
  expect(endState['todolistId2'].length).toBe(4);
  expect(endState['todolistId2'][0].id).toBeDefined();
  expect(endState['todolistId2'][0].title).toBe('juce');
  expect(endState['todolistId2'][0].status).toBe(TaskStatuses.New);
});

test('status of specified task should be changed', () => {
  const action = updateTaskTC.fulfilled(
    {
      taskId: '2',
      model: { status: TaskStatuses.New },
      todoId: 'todolistId2',
    },
    'requestId',
    {
      taskId: '2',
      domainModel: { status: TaskStatuses.New },
      todoId: 'todolistId2',
    }
  );

  const endState = tasksReducer(startState, action);

  expect(endState['todolistId2'][1].status).toBe(TaskStatuses.New);
});

test('task title should be changed', () => {
  const action = updateTaskTC.fulfilled(
    {
      taskId: '1',
      model: { title: 'REACT' },
      todoId: 'todolistId1',
    },
    'requestId',
    {
      taskId: '1',
      domainModel: { title: 'REACT' },
      todoId: 'todolistId1',
    }
  );
  const endState = tasksReducer(startState, action);

  expect(endState['todolistId1'][0].title).toBe('REACT');
});

test('new array should be added when new todolist is added', () => {
  const todo: TodolistType = {
    addedDate: '',
    id: '435fsdxg-dsf5',
    order: 1,
    title: 'new todolist',
  };
  const action = addTodoTC.fulfilled({ todo }, 'requestId', { title: todo.title });

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
  const action = removeTodoTC.fulfilled({ todoId: 'todolistId2' }, 'requestId', { todoId: 'todolistId2' });

  const endState = tasksReducer(startState, action);

  const keys = Object.keys(endState);

  expect(keys.length).toBe(1);
  expect(endState['todolistId2']).not.toBeDefined();
});
