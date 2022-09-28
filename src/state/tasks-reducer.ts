import { AxiosError } from 'axios';
import { RequestStatusType, setAppStatusAC } from './app-reducer';
import { taskAPI, TaskPriorities, TaskStatuses, TaskType, UpdateTaskModelType } from '../api/task-api';
import { handleAppError, handleNetworkError } from '../utils/error-utils';
import { AppRootStateType } from './store';
import { createAsyncThunk, createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { addTodolistAC, removeTodolistAC, setTodolistAC } from './todolists-reducer';

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

const initialState: TasksStateType = {};
const slice = createSlice({
  name: 'tasks',
  initialState: initialState,
  reducers: {
    updateTaskAC(state, action: PayloadAction<{ taskId: string; model: UpdateDomainTaskModelType; todoId: string }>) {
      const tasks = state[action.payload.todoId];
      const taskIndex = tasks.findIndex((t) => t.id === action.payload.taskId);
      if (taskIndex > -1) {
        tasks[taskIndex] = { ...tasks[taskIndex], ...action.payload.model };
      }
    },
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
    builder.addCase(addTodolistAC, (state, action) => {
      state[action.payload.todo.id] = [];
    });
    builder.addCase(removeTodolistAC, (state, action) => {
      delete state[action.payload.todoId];
    });
    builder.addCase(setTodolistAC, (state, action) => {
      action.payload.todolists.forEach((tl) => (state[tl.id] = []));
    });
    builder.addCase(getTasksTC.fulfilled, (state, action) => {
      state[action.payload.todoId] = action.payload.tasks.map((t) => ({ ...t, entityTaskStatus: 'idle' }));
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
  },
});

export const tasksReducer = slice.reducer;
export const { changeTaskEntityStatusAC, updateTaskAC } = slice.actions;

// export const tasksReducer = (state: TasksStateType = initialState, action: TaskActionsType): TasksStateType => {
//   switch (action.type) {
//     case 'GET-TASKS': {
//       // const copyState = { ...state };
//       // copyState[action.todoId] = action.tasks;
//       // return copyState;
//       return { ...state, [action.todoId]: action.tasks.map((t) => ({ ...t, entityTaskStatus: 'idle' })) };
//     }

//     case 'REMOVE-TASK':
//       return {
//         ...state,
//         [action.todoId]: state[action.todoId].filter((t) => t.id !== action.taskId),
//       };

//     case 'ADD-TASK': {
//       const copyState = { ...state };
//       const newTask = action.task;
//       const domainNewTask: TaskDomainType = { ...newTask, entityTaskStatus: 'idle' };
//       copyState[action.task.todoListId] = [domainNewTask, ...copyState[action.task.todoListId]];
//       return copyState;
//     }

//     case 'UPDATE-TASK':
//       return {
//         ...state,
//         [action.todoId]: state[action.todoId].map((t) => (t.id === action.taskId ? { ...t, ...action.model } : t)),
//       };

//     case 'SET-TODOLIST': {
//       const copyState = { ...state };
//       action.todolists.forEach((tl) => (copyState[tl.id] = []));
//       return copyState;
//     }

//     case 'ADD-TODOLIST':
//       return { ...state, [action.todo.id]: [] };

//     case 'REMOVE-TODOLIST':
//       const copyState = { ...state };
//       delete copyState[action.todoId];
//       return copyState;

//     case 'CHANGE-TASK-ENTITY-STATUS':
//       return {
//         ...state,
//         [action.todoId]: state[action.todoId].map((t) => {
//           //вариант для дизейбла только одной таски
//           return t.id === action.taskId ? { ...t, entityTaskStatus: action.entityTaskStatus } : t;
//           // вариант для дизейбла всех тасок конкретного todo
//           // return { ...t, entityTaskStatus: action.entityTaskStatus };
//         }),
//       };

//     default:
//       return state;
//   }
// };

// export const removeTaskAC = (todoId: string, taskId: string) => {
//   return { type: 'REMOVE-TASK', todoId, taskId } as const;
// };
// export const addTaskAC = (task: TaskType) => {
//   return { type: 'ADD-TASK', task } as const;
// };
// export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todoId: string) => {
//   return { type: 'UPDATE-TASK', taskId, model, todoId } as const;
// };
// export const getTasksAC = (todoId: string, tasks: TaskType[]) => {
//   return { type: 'GET-TASKS', todoId, tasks } as const;
// };
// export const changeTaskEntityStatusAC = (todoId: string, entityTaskStatus: RequestStatusType, taskId: string) => {
//   return { type: 'CHANGE-TASK-ENTITY-STATUS', todoId, entityTaskStatus, taskId } as const;
// };

// Thunks

// export const getTasksTC_ = (todoId: string) => (dispatch: Dispatch) => {
//   dispatch(setAppStatusAC({ status: 'loading' }));
//   taskAPI.getTasks(todoId).then((res) => {
//     const tasks = res.data.items;
//     dispatch(getTasksAC({ todoId: todoId, tasks: tasks }));
//     dispatch(setAppStatusAC({ status: 'succeeded' }));
//   });
// };

// export const deleteTaskTC_ = (todoId: string, taskId: string) => (dispatch: Dispatch) => {
//   dispatch(setAppStatusAC({ status: 'loading' }));
//   dispatch(changeTaskEntityStatusAC({ todoId: todoId, entityTaskStatus: 'loading', taskId: taskId }));
//   taskAPI
//     .deleteTask(todoId, taskId)
//     .then((res) => {
//       if (res.data.resultCode === 0) {
//         dispatch(removeTaskAC({ todoId, taskId }));
//         dispatch(setAppStatusAC({ status: 'succeeded' }));
//       } else {
//         handleAppError(dispatch, res.data);
//       }
//       dispatch(setAppStatusAC({ status: 'failed' }));
//     })
//     .catch((err: AxiosError) => {
//       handleNetworkError(dispatch, err.message);
//     });
// };

export const updateTaskTC =
  (todoId: string, taskId: string, domainModel: UpdateDomainTaskModelType) =>
  (dispatch: Dispatch, getState: () => AppRootStateType) => {
    const state = getState();
    const allTasksState = state.tasks;
    const tasksForCurrentTodo = allTasksState[todoId];

    const task = tasksForCurrentTodo.find((t) => {
      return t.id === taskId;
    });

    if (task) {
      const apiModel: UpdateTaskModelType = {
        title: task.title,
        status: task.status,
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        ...domainModel,
      };
      dispatch(setAppStatusAC({ status: 'loading' }));
      taskAPI
        .updateTask(todoId, taskId, apiModel)
        .then((res) => {
          if (res.data.resultCode === 0) {
            dispatch(updateTaskAC({ taskId, model: domainModel, todoId }));
            dispatch(setAppStatusAC({ status: 'succeeded' }));
          } else {
            handleAppError(dispatch, res.data);
          }
          dispatch(setAppStatusAC({ status: 'failed' }));
        })
        .catch((err: AxiosError) => {
          handleNetworkError(dispatch, err.message);
        });
    }
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

//types
// export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>;
// export type AddTaskActionType = ReturnType<typeof addTaskAC>;
// export type UpdateTaskActionType = ReturnType<typeof updateTaskAC>;
// export type GetTasksActionType = ReturnType<typeof getTasksAC>;
// export type ChangeTaskEntityStatusActionType = ReturnType<typeof changeTaskEntityStatusAC>;

// export type TaskActionsType =
//   | RemoveTaskActionType
//   | AddTaskActionType
//   | UpdateTaskActionType
//   | AddTodolistActionType
//   | RemoveTodolistActionType
//   | SetTodolistActionType
//   | GetTasksActionType
//   | ChangeTaskEntityStatusActionType;

export type TaskDomainType = TaskType & {
  entityTaskStatus: RequestStatusType;
};

export type TasksStateType = {
  [todolistId: string]: Array<TaskDomainType>;
};
