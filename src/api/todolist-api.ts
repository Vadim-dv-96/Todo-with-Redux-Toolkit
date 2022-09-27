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

export const authAPI = {
  login(loginPayload: LoginParamsType) {
    return instance.post<BaseResponseType<{ userId: number }>>('auth/login', loginPayload);
  },
  me() {
    return instance.get<BaseResponseType<AuthMeResponseType>>('auth/me');
  },
  logOut() {
    return instance.delete<BaseResponseType>('auth/login');
  },
};

//types
export type LoginParamsType = {
  email: string;
  password: string;
  rememberMe?: boolean;
  captcha?: string;
};
export type AuthMeResponseType = {
  id: number;
  email: string;
  login: string;
};
export type FieldsErrorsType = {
  error: string;
  field: string;
};
export type BaseResponseType<T = {}> = {
  resultCode: number;
  messages: Array<string>;
  fieldsErrors: Array<FieldsErrorsType>;
  data: T;
};
export type TodolistType = {
  id: string;
  addedDate: string;
  order: number;
  title: string;
};
