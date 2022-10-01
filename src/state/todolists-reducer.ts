import { AxiosError } from 'axios';
import { RequestStatusType, setAppStatusAC } from './app-reducer';
import { todolistAPI, TodolistType } from '../api/todolist-api';
import { handleAppError, handleNetworkError } from '../utils/error-utils';
import { getTasksTC } from './tasks-reducer';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export const getTodosTC = createAsyncThunk('todolists/getTodos', async (params, thunkAPI) => {
  thunkAPI.dispatch(setAppStatusAC({ status: 'loading' }));
  try {
    const res = await todolistAPI.getTodolists();
    thunkAPI.dispatch(setAppStatusAC({ status: 'succeeded' }));
    res.data.forEach((tl) => {
      thunkAPI.dispatch(getTasksTC(tl.id));
    });
    return { todolists: res.data };
  } catch (err) {
    const error: AxiosError = err as AxiosError;
    handleNetworkError(thunkAPI.dispatch, error.message);
    return thunkAPI.rejectWithValue(null);
  }
});

export const removeTodoTC = createAsyncThunk('todolists/removeTodo', async (params: { todoId: string }, thunkAPI) => {
  thunkAPI.dispatch(setAppStatusAC({ status: 'loading' }));
  thunkAPI.dispatch(changeTodolistEntityStatusAC({ todoId: params.todoId, entityStatus: 'loading' }));
  try {
    const res = await todolistAPI.deleteTodolist(params.todoId);
    if (res.data.resultCode === 0) {
      thunkAPI.dispatch(setAppStatusAC({ status: 'succeeded' }));
      return { todoId: params.todoId };
    } else {
      handleAppError(thunkAPI.dispatch, res.data);
      thunkAPI.dispatch(setAppStatusAC({ status: 'failed' }));
      return thunkAPI.rejectWithValue(null);
    }
  } catch (err) {
    const error: AxiosError = err as AxiosError;
    handleNetworkError(thunkAPI.dispatch, error.message);
    return thunkAPI.rejectWithValue(null);
  }
});

export const addTodoTC = createAsyncThunk('todolists/addTodo', async (params: { title: string }, thunkAPI) => {
  thunkAPI.dispatch(setAppStatusAC({ status: 'loading' }));
  try {
    const res = await todolistAPI.createTodolist(params.title);
    if (res.data.resultCode === 0) {
      const todo = res.data.data.item;
      thunkAPI.dispatch(setAppStatusAC({ status: 'succeeded' }));
      return { todo: todo };
    } else {
      handleAppError(thunkAPI.dispatch, res.data);
      thunkAPI.dispatch(setAppStatusAC({ status: 'failed' }));
      return thunkAPI.rejectWithValue(null);
    }
  } catch (err) {
    const error: AxiosError = err as AxiosError;
    handleNetworkError(thunkAPI.dispatch, error.message);
    return thunkAPI.rejectWithValue(null);
  }
});

export const changeTodoTitleTC = createAsyncThunk(
  'todolists/changeTodoTitle',
  async (params: { todoId: string; title: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({ status: 'loading' }));
    try {
      const res = await todolistAPI.updateTodolist(params.todoId, params.title);
      if (res.data.resultCode === 0) {
        thunkAPI.dispatch(setAppStatusAC({ status: 'succeeded' }));
        return { todoId: params.todoId, title: params.title };
      } else {
        handleAppError(thunkAPI.dispatch, res.data);
        thunkAPI.dispatch(setAppStatusAC({ status: 'failed' }));
        return thunkAPI.rejectWithValue(null);
      }
    } catch (err) {
      const error: AxiosError = err as AxiosError;
      handleNetworkError(thunkAPI.dispatch, error.message);
      return thunkAPI.rejectWithValue(null);
    }
  }
);

const initialState: Array<TodolistDomainType> = [];
const slice = createSlice({
  name: 'todolists',
  initialState: initialState,
  reducers: {
    changeTodolistFilterAC(state, action: PayloadAction<{ todoId: string; filter: FilterValueType }>) {
      const index = state.findIndex((tl) => tl.id === action.payload.todoId);
      state[index].filter = action.payload.filter;
    },
    changeTodolistEntityStatusAC(state, action: PayloadAction<{ todoId: string; entityStatus: RequestStatusType }>) {
      const index = state.findIndex((tl) => tl.id === action.payload.todoId);
      state[index].entityStatus = action.payload.entityStatus;
    },
  },
  extraReducers(builder) {
    builder.addCase(getTodosTC.fulfilled, (state, action) => {
      return action.payload.todolists.map((tl) => ({ ...tl, filter: 'all', entityStatus: 'idle' }));
    });
    builder.addCase(removeTodoTC.fulfilled, (state, action) => {
      const index = state.findIndex((tl) => tl.id === action.payload.todoId);
      if (index > -1) {
        state.splice(index, 1);
      }
    });
    builder.addCase(addTodoTC.fulfilled, (state, action) => {
      state.unshift({ ...action.payload.todo, filter: 'all', entityStatus: 'idle' });
    });
    builder.addCase(changeTodoTitleTC.fulfilled, (state, action) => {
      const index = state.findIndex((tl) => tl.id === action.payload.todoId);
      state[index].title = action.payload.title;
    });
  },
});

export const todolistsReducer = slice.reducer;

export const { changeTodolistEntityStatusAC, changeTodolistFilterAC } = slice.actions;

//types
export type FilterValueType = 'all' | 'active' | 'completed';

export type TodolistDomainType = TodolistType & {
  filter: FilterValueType;
  entityStatus: RequestStatusType;
};

export type ChangeTodolistFilterActionType = ReturnType<typeof changeTodolistFilterAC>;
export type ChangeTodolistEntityStatusActionType = ReturnType<typeof changeTodolistEntityStatusAC>;
