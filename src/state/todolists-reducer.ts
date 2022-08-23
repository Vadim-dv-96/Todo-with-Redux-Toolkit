import { AxiosError } from 'axios';
import { RequestStatusType, setAppStatusAC } from './app-reducer';
import { todolistAPI, TodolistType } from '../api/todolist-api';
import { handleAppError, handleNetworkError } from '../utils/error-utils';
import { AppThunk } from './store';
import { getTasksTC } from './tasks-reducer';

const initialState: Array<TodolistDomainType> = [];

export const todolistsReducer = (
  state: Array<TodolistDomainType> = initialState,
  action: TodoActionsType
): Array<TodolistDomainType> => {
  switch (action.type) {
    case 'REMOVE-TODOLIST': {
      const newState = state.filter((tl) => tl.id !== action.todoId);
      return newState;
    }

    case 'ADD-TODOLIST':
      return [{ ...action.todo, filter: 'all', entityStatus: 'idle' }, ...state];

    case 'CHANGE-TODOLIST-TITLE': {
      // const copyState = [...state];
      // const todolist = copyState.find((t) => t.id === action.id);
      // if (todolist) {
      //   todolist.title = action.title;
      // }
      // return copyState;
      return state.map((tl) => (tl.id === action.id ? { ...tl, title: action.title } : tl));
    }

    case 'CHANGE-TODOLIST-FILTER': {
      // const copyState = [...state];
      // const todolist = copyState.find((tl) => {
      //   return tl.id === action.id;
      // });
      // if (todolist) {
      //   todolist.filter = action.filter;
      // }
      // return copyState;
      return state.map((tl) => (tl.id === action.id ? { ...tl, filter: action.filter } : tl));
    }

    case 'SET-TODOLIST':
      return action.todolists.map((tl) => ({ ...tl, filter: 'all', entityStatus: 'idle' }));

    case 'CHANGE-TODO-ENTITY-STATUS':
      return state.map((tl) => {
        return tl.id === action.todoId ? { ...tl, entityStatus: action.entityStatus } : tl;
      });

    default:
      return state;
  }
};

//Action Creators
export const removeTodolistAC = (todoId: string) => {
  return { type: 'REMOVE-TODOLIST', todoId } as const;
};
export const addTodolistAC = (todo: TodolistType) => {
  return { type: 'ADD-TODOLIST', todo } as const;
};
export const changeTodolistTitleAC = (todoId: string, title: string) => {
  return { type: 'CHANGE-TODOLIST-TITLE', id: todoId, title } as const;
};
export const changeTodolistFilterAC = (todoId: string, filter: FilterValueType) => {
  return { type: 'CHANGE-TODOLIST-FILTER', id: todoId, filter } as const;
};
export const setTodolistAC = (todolists: Array<TodolistType>) => {
  return { type: 'SET-TODOLIST', todolists } as const;
};
export const changeTodolistEntityStatusAC = (todoId: string, entityStatus: RequestStatusType) => {
  return { type: 'CHANGE-TODO-ENTITY-STATUS', todoId, entityStatus } as const;
};

//Thunks(TC)
export const getTodosTC = (): AppThunk => {
  return (dispatch) => {
    dispatch(setAppStatusAC('loading'));
    todolistAPI
      .getTodolists()
      .then((res) => {
        dispatch(setTodolistAC(res.data));
        dispatch(setAppStatusAC('succeeded'));
        return res.data;
      })
      .then((todos) => {
        todos.forEach((tl) => {
          dispatch(getTasksTC(tl.id)); //fix bag( что бы запрос за тасками шел последовательно после запроса getTodo)
        });
      });
  };
};

export const addTodoTC =
  (title: string): AppThunk =>
  (dispatch) => {
    dispatch(setAppStatusAC('loading'));
    todolistAPI
      .createTodolist(title)
      .then((res) => {
        if (res.data.resultCode === 0) {
          const todo = res.data.data.item;
          dispatch(addTodolistAC(todo));
          dispatch(setAppStatusAC('succeeded'));
        } else {
          handleAppError(dispatch, res.data);
        }
        dispatch(setAppStatusAC('failed'));
      })
      .catch((err: AxiosError) => {
        handleNetworkError(dispatch, err.message);
      });
  };

export const removeTodoTC =
  (todoId: string): AppThunk =>
  (dispatch) => {
    dispatch(setAppStatusAC('loading'));
    dispatch(changeTodolistEntityStatusAC(todoId, 'loading'));
    todolistAPI
      .deleteTodolist(todoId)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(removeTodolistAC(todoId));
          dispatch(setAppStatusAC('succeeded'));
        } else {
          handleAppError(dispatch, res.data);
        }
        dispatch(setAppStatusAC('failed'));
      })
      .catch((err: AxiosError) => {
        handleNetworkError(dispatch, err.message);
      });
  };

export const changeTodoTitleTC =
  (todoId: string, title: string): AppThunk =>
  (dispatch) => {
    dispatch(setAppStatusAC('loading'));
    todolistAPI
      .updateTodolist(todoId, title)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(changeTodolistTitleAC(todoId, title));
          dispatch(setAppStatusAC('succeeded'));
        } else {
          handleAppError(dispatch, res.data);
        }
        dispatch(setAppStatusAC('failed'));
      })
      .catch((err: AxiosError) => {
        handleNetworkError(dispatch, err.message);
      });
  };

//types
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type ChangeTodolistTitleActionType = ReturnType<typeof changeTodolistTitleAC>;
export type ChangeTodolistFilterActionType = ReturnType<typeof changeTodolistFilterAC>;
export type SetTodolistActionType = ReturnType<typeof setTodolistAC>;
export type ChangeTodolistEntityStatusActionType = ReturnType<typeof changeTodolistEntityStatusAC>;

export type TodoActionsType =
  | RemoveTodolistActionType
  | AddTodolistActionType
  | ChangeTodolistTitleActionType
  | ChangeTodolistFilterActionType
  | SetTodolistActionType
  | ChangeTodolistEntityStatusActionType;

export type FilterValueType = 'all' | 'active' | 'completed';

export type TodolistDomainType = TodolistType & {
  filter: FilterValueType;
  entityStatus: RequestStatusType;
};
