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
      return [{ ...action.todo, filter: 'all' }, ...state];

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

//Thunks(TC)
export const getTodosTC = (): AppThunk => {
  return (dispatch) => {
    todolistAPI.getTodolists().then((res) => {
      dispatch(setTodolistAC(res.data));
    });
  };
};

export const addTodoTC =
  (title: string): AppThunk =>
  (dispatch) => {
    todolistAPI.createTodolist(title).then((res) => {
      const todo = res.data.data.item;
      dispatch(addTodolistAC(todo));
    });
  };

export const removeTodoTC =
  (todoId: string): AppThunk =>
  (dispatch) => {
    todolistAPI.deleteTodolist(todoId).then((res) => {
      dispatch(removeTodolistAC(todoId));
    });
  };

export const changeTodoTitleTC =
  (todoId: string, title: string): AppThunk =>
  (dispatch) => {
    todolistAPI.updateTodolist(todoId, title).then((res) => {
      dispatch(changeTodolistTitleAC(todoId, title));
    });
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
