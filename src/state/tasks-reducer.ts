import { AxiosError } from 'axios';
import { RequestStatusType, setAppStatusAC } from './app-reducer';
import { taskAPI, TaskPriorities, TaskStatuses, TaskType, UpdateTaskModelType } from '../api/task-api';
import { handleAppError, handleNetworkError } from '../utils/error-utils';
import { AppRootStateType } from './store';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addTodoTC, getTodosTC, removeTodoTC } from './todolists-reducer';

export const getTasksTC = createAsyncThunk('tasks/getTasks', async (todoId: string, thunkAPI) => {
  thunkAPI.dispatch(setAppStatusAC({ status: 'loading' }));
  try {
    const res = await taskAPI.getTasks(todoId);
    const tasks = res.data.items;
    thunkAPI.dispatch(setAppStatusAC({ status: 'succeeded' }));
    return { todoId: todoId, tasks: tasks };
  } catch (err) {
    const error: AxiosError = err as AxiosError;
    handleNetworkError(thunkAPI.dispatch, error.message);
    return thunkAPI.rejectWithValue(null);
  }
});

export const deleteTaskTC = createAsyncThunk(
  'tasks/deleteTask',
  async (param: { todoId: string; taskId: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({ status: 'loading' }));
    thunkAPI.dispatch(
      changeTaskEntityStatusAC({ todoId: param.todoId, entityTaskStatus: 'loading', taskId: param.taskId })
    );
    try {
      const res = await taskAPI.deleteTask(param.todoId, param.taskId);
      if (res.data.resultCode === 0) {
        thunkAPI.dispatch(setAppStatusAC({ status: 'succeeded' }));
        return { todoId: param.todoId, taskId: param.taskId };
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

export const addTaskTC = createAsyncThunk(
  'tasks/addTask',
  async (params: { todoId: string; title: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({ status: 'loading' }));
    try {
      const res = await taskAPI.createTask(params.todoId, params.title);
      if (res.data.resultCode === 0) {
        thunkAPI.dispatch(setAppStatusAC({ status: 'succeeded' }));
        const task = res.data.data.item;
        return task;
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

export const updateTaskTC = createAsyncThunk(
  'tasks/updateTask',
  async (params: { todoId: string; taskId: string; domainModel: UpdateDomainTaskModelType }, thunkAPI) => {
    const state = thunkAPI.getState() as AppRootStateType;
    const allTasksState = state.tasks;
    const tasksForCurrentTodo = allTasksState[params.todoId];

    const task = tasksForCurrentTodo.find((t) => {
      return t.id === params.taskId;
    });

    if (!task) {
      return thunkAPI.rejectWithValue(null);
    }

    const apiModel: UpdateTaskModelType = {
      title: task.title,
      status: task.status,
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      ...params.domainModel,
    };
    thunkAPI.dispatch(setAppStatusAC({ status: 'loading' }));
    try {
      const res = await taskAPI.updateTask(params.todoId, params.taskId, apiModel);
      if (res.data.resultCode === 0) {
        thunkAPI.dispatch(setAppStatusAC({ status: 'succeeded' }));
        return { taskId: params.taskId, model: params.domainModel, todoId: params.todoId };
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

const initialState: TasksStateType = {};
const slice = createSlice({
  name: 'tasks',
  initialState: initialState,
  reducers: {
    changeTaskEntityStatusAC(
      state,
      action: PayloadAction<{ todoId: string; entityTaskStatus: RequestStatusType; taskId: string }>
    ) {
      const tasks = state[action.payload.todoId];
      const taskIndex = tasks.findIndex((t) => t.id === action.payload.taskId);
      if (taskIndex > -1) {
        tasks[taskIndex].entityTaskStatus = action.payload.entityTaskStatus;
      }
    },
  },
  extraReducers(builder) {
    builder.addCase(addTodoTC.fulfilled, (state, action) => {
      state[action.payload.todo.id] = [];
    });
    builder.addCase(removeTodoTC.fulfilled, (state, action) => {
      delete state[action.payload.todoId];
    });
    builder.addCase(getTodosTC.fulfilled, (state, action) => {
      action.payload.todolists.forEach((tl) => (state[tl.id] = []));
    });
    builder.addCase(getTasksTC.fulfilled, (state, action) => {
      state[action.payload.todoId] = action.payload.tasks.map((t) => {
        return { ...t, entityTaskStatus: 'idle' };
      });
    });
    builder.addCase(deleteTaskTC.fulfilled, (state, action) => {
      const tasks = state[action.payload.todoId];
      const taskIndex = tasks.findIndex((t) => t.id === action.payload.taskId);
      if (taskIndex > -1) {
        tasks.splice(taskIndex, 1);
      }
    });
    builder.addCase(addTaskTC.fulfilled, (state, action) => {
      const newTask = action.payload;
      const domainNewTask: TaskDomainType = { ...newTask, entityTaskStatus: 'idle' };
      state[action.payload.todoListId].unshift(domainNewTask);
    });
    builder.addCase(updateTaskTC.fulfilled, (state, action) => {
      const tasks = state[action.payload.todoId];
      const taskIndex = tasks.findIndex((t) => t.id === action.payload.taskId);
      if (taskIndex > -1) {
        tasks[taskIndex] = { ...tasks[taskIndex], ...action.payload.model };
      }
    });
  },
});

export const tasksReducer = slice.reducer;
export const { changeTaskEntityStatusAC } = slice.actions;

//types
export type TaskDomainType = TaskType & {
  entityTaskStatus: RequestStatusType;
};

export type TasksStateType = {
  [todolistId: string]: Array<TaskDomainType>;
};

// type for modelDomain
export type UpdateDomainTaskModelType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};
