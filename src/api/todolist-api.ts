import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://social-network.samuraijs.com/api/1.1/',
  withCredentials: true,
  headers: {
    'API-KEY': '9e4686de-4379-4e75-89bc-e99abdd3cdc3',
  },
});
export const todolistAPI = {
  getTodolists() {
    return instance.get<Array<TodolistType>>('todo-lists');
  },
  createTodolist(title: string) {
    return instance.post<BaseResponseType<{ item: TodolistType }>>('todo-lists', { title });
  },
  deleteTodolist(todoId: string) {
    return instance.delete<BaseResponseType>(`todo-lists/${todoId}`);
  },
  updateTodolist(todoId: string, title: string) {
    return instance.put<BaseResponseType>(`todo-lists/${todoId}`, { title });
  },
};
//types
export type BaseResponseType<T = {}> = {
  resultCode: number;
  messages: Array<string>;
  fieldsErrors: Array<string>;
  data: T;
};
export type TodolistType = {
  id: string;
  addedDate: string;
  order: number;
  title: string;
};
// export type CreateTodoType = {
//   resultCode: number;
//   messages: Array<string>;
//   data: { item: TodoType };
//   fieldsErrors: Array<string>;
// };
// export type DeleteTodoType = {
//   resultCode: number;
//   messages: Array<string>;
//   data: {};
//   fieldsErrors: Array<string>;
// };
// export type UpdateTodoType = {
//   resultCode: number;
//   messages: Array<string>;
//   data: {};
//   fieldsErrors: Array<string>;
// };
