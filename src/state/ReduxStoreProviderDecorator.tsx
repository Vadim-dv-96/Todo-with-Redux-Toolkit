import React, { ReactElement } from 'react';
import { Provider } from 'react-redux';
import { combineReducers, createStore, legacy_createStore } from 'redux';
import { v1 } from 'uuid';
import { TaskPriorities, TaskStatuses } from '../api/task-api';
import { AppRootStateType, store } from './store';
import { tasksReducer } from './tasks-reducer';
import { todolistsReducer } from './todolists-reducer';

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
});

const initialGlobalState = {
  todolists: [
    { id: 'todolistId1', title: 'What to learn', filter: 'all', addedDate: '', order: 0 },
    { id: 'todolistId2', title: 'What to buy', filter: 'all', addedDate: '', order: 0 },
  ],
  tasks: {
    ['todolistId1']: [
      {
        id: v1(),
        title: 'HTML&CSS',
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
        id: v1(),
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
    ],
    ['todolistId2']: [
      {
        id: v1(),
        title: 'Milk',
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
        id: v1(),
        title: 'React Book',
        status: TaskStatuses.Completed,
        todoListId: 'todolistId2',
        addedDate: '',
        deadline: '',
        startDate: '',
        order: 0,
        priority: TaskPriorities.Low,
        description: '',
      },
    ],
  },
};

export const storyBookStore = legacy_createStore(rootReducer, initialGlobalState as AppRootStateType);

export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
  return <Provider store={storyBookStore}>{storyFn()}</Provider>;
};
