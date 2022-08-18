import { applyMiddleware, combineReducers, legacy_createStore } from 'redux';
import thunk, { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { appReducer, StatusAndErrorsActionType } from './app-reducer';
import { TaskActionsType, tasksReducer } from './tasks-reducer';
import { TodoActionsType, todolistsReducer } from './todolists-reducer';

export const rootReducer = combineReducers({
  todolists: todolistsReducer,
  tasks: tasksReducer,
  api: appReducer,
});

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));

export type AppRootStateType = ReturnType<typeof rootReducer>;

// общий тип экшенов всех редьюсеров(вместо AnyAction в типах AppDispatch и AppThunk)
export type AllActionsType = TodoActionsType | TaskActionsType | StatusAndErrorsActionType;

// типизация хука dispatch в папке hooks
export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AllActionsType>;

// типизация санок
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AllActionsType>;
