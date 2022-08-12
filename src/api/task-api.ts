import axios from 'axios';
import { BaseResponseType } from './todolist-api';

const instance = axios.create({
  baseURL: 'https://social-network.samuraijs.com/api/1.1/',
  withCredentials: true,
  headers: {
    'API-KEY': '9e4686de-4379-4e75-89bc-e99abdd3cdc3',
  },
});
export const taskAPI = {
  getTasks(todolistId: string) {
    return instance.get<GetTasksType>(`todo-lists/${todolistId}/tasks`);
  },
  createTask(todolistId: string, title: string) {
    return instance.post<BaseResponseType<{ item: TaskType }>>(`todo-lists/${todolistId}/tasks`, { title });
  },
  deleteTask(todolistId: string, taskId: string) {
    return instance.delete<BaseResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`);
  },
  updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
    return instance.put<BaseResponseType<{ item: TaskType }>>(`todo-lists/${todolistId}/tasks/${taskId}`, model);
  },
};
//types
export type UpdateTaskModelType = {
  title: string;
  description: string;
  status: TaskStatuses;
  priority: TaskPriorities;
  startDate: string;
  deadline: string;
};
export enum TaskStatuses {
  New = 0,
  InProgress = 1,
  Completed = 2,
  Draft = 3,
}
export enum TaskPriorities {
  Low = 0,
  Middle = 1,
  Hi = 2,
  Urgently = 3,
  Later = 4,
}
export type TaskType = {
  description: string;
  title: string;
  status: TaskStatuses;
  priority: TaskPriorities;
  startDate: string;
  deadline: string;
  id: string;
  order: number;
  todoListId: string;
  addedDate: string;
};
export type GetTasksType = {
  error: string | null;
  items: Array<TaskType>;
  totalCount: number;
};
// export type UpdateTaskType = {
//   data: {
//     item: {
//       addedDate: string;
//       deadline: string;
//       description: string;
//       id: string;
//       order: number;
//       priority: number;
//       startDate: string;
//       status: number;
//       title: string;
//       todoListId: string;
//     };
//   };
//   resultCode: number;
//   messages: Array<string>;
//   fieldsErrors: Array<string>;
// };
