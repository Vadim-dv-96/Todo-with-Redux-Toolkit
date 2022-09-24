import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import thunk, { ThunkAction, ThunkDispatch } from 'redux-thunk';
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

// export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk),
});

export type AppRootStateType = ReturnType<typeof rootReducer>;

// общий тип экшенов всех редьюсеров(вместо AnyAction в типах AppDispatch и AppThunk)
// export type AllActionsType = TodoActionsType | TaskActionsType | AppReducerActionType | AuthActionsType;

// типизация хука dispatch в папке hooks
// export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AllActionsType>;

// типизация санок
// export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AllActionsType>;
