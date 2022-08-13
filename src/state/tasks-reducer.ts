import { taskAPI, TaskPriorities, TaskStatuses, TaskType, UpdateTaskModelType } from '../api/task-api';
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

// Thunks
// export const updateTaskTitleTC =
//   (todoId: string, taskId: string, title: string): AppThunk =>
//   (dispatch, getState: () => AppRootStateType) => {
//     const state = getState();
//     const allTasksState = state.tasks;
//     const tasksCurrentTodo = allTasksState[todoId];
//     const task = tasksCurrentTodo.find((t) => t.id === taskId);

//     if (task) {
//       const model: UpdateTaskModelType = {
//         title,
//         status: task.status,
//         deadline: task.deadline,
//         description: task.description,
//         priority: task.priority,
//         startDate: task.startDate,
//       };

//       taskAPI.updateTask(todoId, taskId, model).then((res) => {
//         dispatch(changeTaskTitleAC(todoId, taskId, title));
//       });
//     }
//   };
// type for modelDomain
export type UpdateDomainTaskModelType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};
export const updateTaskTC =
  (todoId: string, taskId: string, domainModel: UpdateDomainTaskModelType): AppThunk =>
  (dispatch, getState: () => AppRootStateType) => {
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

      taskAPI.updateTask(todoId, taskId, apiModel).then((res) => {
        dispatch(updateTaskAC(taskId, domainModel, todoId));
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
export type UpdateTaskActionType = ReturnType<typeof updateTaskAC>;
export type GetTasksActionType = ReturnType<typeof getTasksAC>;

export type TaskActionsType =
  | RemoveTaskActionType
  | AddTaskActionType
  | UpdateTaskActionType
  | AddTodolistActionType
  | RemoveTodolistActionType
  | SetTodolistActionType
  | GetTasksActionType;

export type TasksStateType = {
  [todolistId: string]: Array<TaskType>;
};
