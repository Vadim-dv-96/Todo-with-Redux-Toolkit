import { taskAPI, TaskStatuses, TaskType, UpdateTaskModelType } from '../api/task-api';
import { AppRootStateType, AppThunk } from './store';
import { AddTodolistActionType, RemoveTodolistActionType, SetTodolistActionType } from './todolists-reducer';

const initialState: TasksStateType = {};

export const tasksReducer = (state: TasksStateType = initialState, action: TaskActionsType): TasksStateType => {
  switch (action.type) {
    case 'GET-TASKS': {
      // const copyState = { ...state };
      // copyState[action.todoId] = action.tasks;
      // return copyState;
      return { ...state, [action.todoId]: action.tasks };
    }

    case 'REMOVE-TASK':
      return {
        ...state,
        [action.todoId]: state[action.todoId].filter((t) => t.id !== action.taskId),
      };

    case 'ADD-TASK': {
      const copyState = { ...state };
      const newTask = action.task;
      copyState[action.task.todoListId] = [newTask, ...copyState[action.task.todoListId]];
      return copyState;
    }

    case 'CHANGE-TASK-STATUS':
      return {
        ...state,
        [action.todoId]: state[action.todoId].map((t) => (t.id === action.taskId ? { ...t, status: action.status } : t)),
      };

    case 'CHANGE-TASK-TITLE':
      return {
        ...state,
        [action.todoId]: state[action.todoId].map((t) => {
          return t.id === action.taskId ? { ...t, title: action.taskTitle } : t;
        }),
      };

    case 'SET-TODOLIST': {
      const copyState = { ...state };
      action.todolists.forEach((tl) => (copyState[tl.id] = []));
      return copyState;
    }

    case 'ADD-TODOLIST':
      return { ...state, [action.todoId]: [] };

    case 'REMOVE-TODOLIST':
      const copyState = { ...state };
      delete copyState[action.todoId];
      return copyState;

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
export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todoId: string) => {
  return { type: 'CHANGE-TASK-STATUS', taskId, status, todoId } as const;
};
export const changeTaskTitleAC = (todoId: string, taskId: string, taskTitle: string) => {
  return { type: 'CHANGE-TASK-TITLE', todoId, taskId, taskTitle } as const;
};
export const getTasksAC = (todoId: string, tasks: TaskType[]) => {
  return { type: 'GET-TASKS', todoId, tasks } as const;
};

// Thunks
export const updateTaskStatusTC =
  (todoId: string, taskId: string, status: TaskStatuses): AppThunk =>
  (dispatch, getState: () => AppRootStateType) => {
    const state = getState();
    const allTasksState = state.tasks;
    const tasksForCurrentTodo = allTasksState[todoId];

    const task = tasksForCurrentTodo.find((t) => {
      return t.id === taskId;
    });

    if (task) {
      const model: UpdateTaskModelType = {
        title: task.title,
        status,
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
      };

      taskAPI.updateTask(todoId, taskId, model).then((res) => {
        dispatch(changeTaskStatusAC(taskId, status, todoId));
      });
    }
  };

export const getTasksTC =
  (todoId: string): AppThunk =>
  (dispatch) => {
    taskAPI.getTasks(todoId).then((res) => {
      const tasks = res.data.items;
      dispatch(getTasksAC(todoId, tasks));
    });
  };

export const deleteTaskTC =
  (todoId: string, taskId: string): AppThunk =>
  (dispatch) => {
    taskAPI.deleteTask(todoId, taskId).then((res) => {
      dispatch(removeTaskAC(todoId, taskId));
    });
  };

export const addTaskTC =
  (todoId: string, title: string): AppThunk =>
  (dispatch) => {
    taskAPI.createTask(todoId, title).then((res) => {
      const task = res.data.data.item;
      dispatch(addTaskAC(task));
    });
  };

//types
export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>;
export type AddTaskActionType = ReturnType<typeof addTaskAC>;
export type ChangeTaskStatusType = ReturnType<typeof changeTaskStatusAC>;
export type ChangeTaskTitleType = ReturnType<typeof changeTaskTitleAC>;
export type GetTasksType = ReturnType<typeof getTasksAC>;

export type TaskActionsType =
  | RemoveTaskActionType
  | AddTaskActionType
  | ChangeTaskStatusType
  | ChangeTaskTitleType
  | AddTodolistActionType
  | RemoveTodolistActionType
  | SetTodolistActionType
  | GetTasksType;

export type TasksStateType = {
  [todolistId: string]: Array<TaskType>;
};
