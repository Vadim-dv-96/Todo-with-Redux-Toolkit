import { AxiosError } from 'axios';
import { RequestStatusType, setAppStatusAC } from './app-reducer';
import { taskAPI, TaskPriorities, TaskStatuses, TaskType, UpdateTaskModelType } from '../api/task-api';
import { handleAppError, handleNetworkError } from '../utils/error-utils';
import { AppRootStateType } from './store';
import { AddTodolistActionType, RemoveTodolistActionType, SetTodolistActionType } from './todolists-reducer';
import { Dispatch } from '@reduxjs/toolkit';

const initialState: TasksStateType = {};

export const tasksReducer = (state: TasksStateType = initialState, action: TaskActionsType): TasksStateType => {
  switch (action.type) {
    case 'GET-TASKS': {
      // const copyState = { ...state };
      // copyState[action.todoId] = action.tasks;
      // return copyState;
      return { ...state, [action.todoId]: action.tasks.map((t) => ({ ...t, entityTaskStatus: 'idle' })) };
    }

    case 'REMOVE-TASK':
      return {
        ...state,
        [action.todoId]: state[action.todoId].filter((t) => t.id !== action.taskId),
      };

    case 'ADD-TASK': {
      const copyState = { ...state };
      const newTask = action.task;
      const domainNewTask: TaskDomainType = { ...newTask, entityTaskStatus: 'idle' };
      copyState[action.task.todoListId] = [domainNewTask, ...copyState[action.task.todoListId]];
      return copyState;
    }

    case 'UPDATE-TASK':
      return {
        ...state,
        [action.todoId]: state[action.todoId].map((t) => (t.id === action.taskId ? { ...t, ...action.model } : t)),
      };

    case 'SET-TODOLIST': {
      const copyState = { ...state };
      action.todolists.forEach((tl) => (copyState[tl.id] = []));
      return copyState;
    }

    case 'ADD-TODOLIST':
      return { ...state, [action.todo.id]: [] };

    case 'REMOVE-TODOLIST':
      const copyState = { ...state };
      delete copyState[action.todoId];
      return copyState;

    case 'CHANGE-TASK-ENTITY-STATUS':
      return {
        ...state,
        [action.todoId]: state[action.todoId].map((t) => {
          //вариант для дизейбла только одной таски
          return t.id === action.taskId ? { ...t, entityTaskStatus: action.entityTaskStatus } : t;
          // вариант для дизейбла всех тасок конкретного todo
          // return { ...t, entityTaskStatus: action.entityTaskStatus };
        }),
      };

    default:
      return state;
  }
};

export const removeTaskAC = (todoId: string, taskId: string) => {
  return { type: 'REMOVE-TASK', todoId, taskId } as const;
};
export const addTaskAC = (task: TaskType) => {
  return { type: 'ADD-TASK', task } as const;
};
export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todoId: string) => {
  return { type: 'UPDATE-TASK', taskId, model, todoId } as const;
};
export const getTasksAC = (todoId: string, tasks: TaskType[]) => {
  return { type: 'GET-TASKS', todoId, tasks } as const;
};
export const changeTaskEntityStatusAC = (todoId: string, entityTaskStatus: RequestStatusType, taskId: string) => {
  return { type: 'CHANGE-TASK-ENTITY-STATUS', todoId, entityTaskStatus, taskId } as const;
};

// Thunks
export const getTasksTC = (todoId: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC({ status: 'loading' }));
  taskAPI.getTasks(todoId).then((res) => {
    const tasks = res.data.items;
    dispatch(getTasksAC(todoId, tasks));
    dispatch(setAppStatusAC({ status: 'succeeded' }));
  });
};

export const deleteTaskTC = (todoId: string, taskId: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC({ status: 'loading' }));
  dispatch(changeTaskEntityStatusAC(todoId, 'loading', taskId));
  taskAPI
    .deleteTask(todoId, taskId)
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(removeTaskAC(todoId, taskId));
        dispatch(setAppStatusAC({ status: 'succeeded' }));
      } else {
        handleAppError(dispatch, res.data);
      }
      dispatch(setAppStatusAC({ status: 'failed' }));
    })
    .catch((err: AxiosError) => {
      handleNetworkError(dispatch, err.message);
    });
};

export const addTaskTC = (todoId: string, title: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC({ status: 'loading' }));
  taskAPI
    .createTask(todoId, title)
    .then((res) => {
      if (res.data.resultCode === 0) {
        const task = res.data.data.item;
        dispatch(addTaskAC(task));
        dispatch(setAppStatusAC({ status: 'succeeded' }));
      } else {
        handleAppError(dispatch, res.data);
      }
      dispatch(setAppStatusAC({ status: 'failed' }));
    })
    .catch((err: AxiosError) => {
      handleNetworkError(dispatch, err.message);
    });
};

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
            dispatch(updateTaskAC(taskId, domainModel, todoId));
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
export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>;
export type AddTaskActionType = ReturnType<typeof addTaskAC>;
export type UpdateTaskActionType = ReturnType<typeof updateTaskAC>;
export type GetTasksActionType = ReturnType<typeof getTasksAC>;
export type ChangeTaskEntityStatusActionType = ReturnType<typeof changeTaskEntityStatusAC>;

export type TaskActionsType =
  | RemoveTaskActionType
  | AddTaskActionType
  | UpdateTaskActionType
  | AddTodolistActionType
  | RemoveTodolistActionType
  | SetTodolistActionType
  | GetTasksActionType
  | ChangeTaskEntityStatusActionType;

export type TaskDomainType = TaskType & {
  entityTaskStatus: RequestStatusType;
};

export type TasksStateType = {
  [todolistId: string]: Array<TaskDomainType>;
};
