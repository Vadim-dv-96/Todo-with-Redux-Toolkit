import { v1 } from 'uuid';
import { todolistAPI, TodolistType } from '../api/todolist-api';
import { AppThunk } from './store';

const initialState: Array<TodolistDomainType> = [];

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: TodoActionsType): Array<TodolistDomainType> => {
  switch (action.type) {
    case 'REMOVE-TODOLIST': {
      const newState = state.filter((tl) => tl.id !== action.todoId);
      return newState;
    }
    case 'ADD-TODOLIST':
      return [{ id: action.todoId, title: action.title, filter: 'all', addedDate: '', order: 0 }, ...state];
    case 'CHANGE-TODOLIST-TITLE': {
      const copyState = [...state];
      const todolist = copyState.find((t) => t.id === action.id);
      if (todolist) {
        todolist.title = action.title;
      }
      return copyState;
    }
    case 'CHANGE-TODOLIST-FILTER': {
      const copyState = [...state];
      const todolist = copyState.find((tl) => {
        return tl.id === action.id;
      });
      if (todolist) {
        todolist.filter = action.filter;
      }
      return copyState;
    }
    case 'SET-TODOLIST':
      return action.todolists.map((tl) => ({ ...tl, filter: 'all' }));

    default:
      return state;
  }
};

//Action Creators
export const removeTodolistAC = (todoId: string) => {
  return { type: 'REMOVE-TODOLIST', todoId } as const;
};
export const addTodolistAC = (title: string) => {
  return { type: 'ADD-TODOLIST', title, todoId: v1() } as const;
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

//Thunks(TC)

export const getTodosTC = (): AppThunk => {
  return (dispatch) => {
    todolistAPI.getTodolists().then((res) => {
      dispatch(setTodolistAC(res.data));
    });
  };
};

//types
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type ChangeTodolistTitleActionType = ReturnType<typeof changeTodolistTitleAC>;
export type ChangeTodolistFilterActionType = ReturnType<typeof changeTodolistFilterAC>;
export type SetTodolistActionType = ReturnType<typeof setTodolistAC>;

export type TodoActionsType = RemoveTodolistActionType | AddTodolistActionType | ChangeTodolistTitleActionType | ChangeTodolistFilterActionType | SetTodolistActionType;

export type FilterValueType = 'all' | 'active' | 'completed';

export type TodolistDomainType = TodolistType & {
  filter: FilterValueType;
};
