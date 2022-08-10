import { v1 } from 'uuid';
import { TaskPriorities, TaskStatuses, TaskType } from '../api/task-api';
import { AddTodolistActionType, RemoveTodolistActionType } from './todolists-reducer';

const initialState: TasksStateType = {};

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
  switch (action.type) {
    case 'REMOVE-TASK':
      return {
        ...state,
        [action.todoId]: state[action.todoId].filter((t) => t.id !== action.taskId),
      };

    case 'ADD-TASK':
      const newTask = {
        id: v1(),
        title: action.title,
        status: TaskStatuses.New,
        todoListId: action.todoId,
        addedDate: '',
        deadline: '',
        startDate: '',
        order: 0,
        priority: TaskPriorities.Low,
        description: '',
      };
      return { ...state, [action.todoId]: [newTask, ...state[action.todoId]] };

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
export const addTaskAC = (title: string, todoId: string) => {
  return { type: 'ADD-TASK', title, todoId } as const;
};
export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todoId: string) => {
  return { type: 'CHANGE-TASK-STATUS', taskId, status, todoId } as const;
};
export const changeTaskTitleAC = (todoId: string, taskId: string, taskTitle: string) => {
  return { type: 'CHANGE-TASK-TITLE', todoId, taskId, taskTitle } as const;
};

//types
export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>;
export type AddTaskActionType = ReturnType<typeof addTaskAC>;
export type ChangeTaskStatusType = ReturnType<typeof changeTaskStatusAC>;
export type ChangeTaskTitleType = ReturnType<typeof changeTaskTitleAC>;

export type ActionsType = RemoveTaskActionType | AddTaskActionType | ChangeTaskStatusType | ChangeTaskTitleType | AddTodolistActionType | RemoveTodolistActionType;

export type TasksStateType = {
  [todolistId: string]: Array<TaskType>;
};
