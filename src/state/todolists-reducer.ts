import { v1 } from 'uuid';
import { FilterValueType, TodolistType } from '../App';

export const todolistsReducer = (state: Array<TodolistType>, action: ActionsType): Array<TodolistType> => {
  switch (action.type) {
    case 'REMOVE-TODOLIST': {
      const newState = state.filter((tl) => tl.id !== action.id);
      return newState;
    }
    case 'ADD-TODOLIST':
      return [...state, { id: v1(), title: action.title, filter: 'all' }];
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
    default:
      throw new Error("I don't understand this type");
  }
};

export const removeTodolistAC = (todoId: string): RemoveTodolistActionType => {
  return { type: 'REMOVE-TODOLIST', id: todoId };
};
export const addTodolistAC = (title: string): AddTodolistActionType => {
  return { type: 'ADD-TODOLIST', title };
};
export const changeTodolistTitleAC = (todoId: string, title: string): ChangeTodolistTitleActionType => {
  return { type: 'CHANGE-TODOLIST-TITLE', id: todoId, title };
};
export const changeTodolistFilterAC = (todoId: string, filter: FilterValueType): ChangeTodolistFilterActionType => {
  return { type: 'CHANGE-TODOLIST-FILTER', id: todoId, filter };
};

export type RemoveTodolistActionType = {
  type: 'REMOVE-TODOLIST';
  id: string;
};
export type AddTodolistActionType = {
  type: 'ADD-TODOLIST';
  title: string;
};
export type ChangeTodolistTitleActionType = {
  type: 'CHANGE-TODOLIST-TITLE';
  id: string;
  title: string;
};
export type ChangeTodolistFilterActionType = {
  type: 'CHANGE-TODOLIST-FILTER';
  id: string;
  filter: FilterValueType;
};
export type ActionsType =
  | RemoveTodolistActionType
  | AddTodolistActionType
  | ChangeTodolistTitleActionType
  | ChangeTodolistFilterActionType;
