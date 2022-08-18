import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, legacy_createStore } from 'redux';
import thunk from 'redux-thunk';
import { v1 } from 'uuid';
import { appReducer } from './app-reducer';
import { TaskPriorities, TaskStatuses } from '../api/task-api';
import { AppRootStateType } from './store';
import { tasksReducer } from './tasks-reducer';
import { todolistsReducer } from './todolists-reducer';

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  api: appReducer,
});

const initialGlobalState = {
  todolists: [
    { id: 'todolistId1', title: 'What to learn', filter: 'all', addedDate: '', order: 0, entityStatus: 'idle' },
    { id: 'todolistId2', title: 'What to buy', filter: 'all', addedDate: '', order: 0, entityStatus: 'idle' },
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
        entityTaskStatus: 'idle',
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
        entityTaskStatus: 'idle',
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
        entityTaskStatus: 'idle',
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
        entityTaskStatus: 'idle',
      },
    ],
  },
  api: { status: 'idle', error: null },
};

export const storyBookStore = legacy_createStore(rootReducer, initialGlobalState as AppRootStateType, applyMiddleware(thunk));

export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
  return <Provider store={storyBookStore}>{storyFn()}</Provider>;
};
