import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { authReducer } from '../components/Login/auth-reducer';
import { appReducer } from './app-reducer';
import { tasksReducer } from './tasks-reducer';
import { todolistsReducer } from './todolists-reducer';

export const rootReducer = combineReducers({
  todolists: todolistsReducer,
  tasks: tasksReducer,
  api: appReducer,
  auth: authReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk),
});

export type AppRootStateType = ReturnType<typeof rootReducer>;

// типизация хука dispatch в папке hooks
export type AppDispatch = typeof store.dispatch;
