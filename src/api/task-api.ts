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
    return instance.post<BaseResponseType<TaskType>>(`todo-lists/${todolistId}/tasks`, { title });
  },
  deleteTask(todolistId: string, taskId: string) {
    return instance.delete<BaseResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`);
  },
  updateTask(todolistId: string, taskId: string, payload: PayloadUpdateType) {
    return instance.put<UpdateTaskType>(`todo-lists/${todolistId}/tasks/${taskId}`, payload);
  },
};
//types
export type PayloadUpdateType = {
  title: string;
  description: string;
  status: number;
  priority: number;
  startDate: string;
  deadline: string;
};
export type TaskType = {
  description: string;
  title: string;
  status: number;
  priority: number;
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
export type UpdateTaskType = {
  data: {
    item: {
      addedDate: string;
      deadline: string;
      description: string;
      id: string;
      order: number;
      priority: number;
      startDate: string;
      status: number;
      title: string;
      todoListId: string;
    };
  };
  resultCode: number;
  messages: Array<string>;
  fieldsErrors: Array<string>;
};
