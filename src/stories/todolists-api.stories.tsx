import { useEffect, useState } from 'react';
import { todolistAPI } from '../api/todolist-api';

export default {
  title: 'API',
};

export const GetTodolists = () => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {
    todolistAPI.getTodolists().then((res) => {
      setState(res.data);
    });
  }, []);

  return <div> {JSON.stringify(state)}</div>;
};
export const CreateTodolist = () => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {
    const title = 'HTML33333';
    todolistAPI.createTodolist(title).then((res) => setState(res.data));
  }, []);

  return <div> {JSON.stringify(state)}</div>;
};
export const DeleteTodolist = () => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {
    const todoId = '7d1b228b-8c10-4534-b6c8-9b7dc759d4e4';
    todolistAPI.deleteTodolist(todoId).then((res) => setState(res.data));
  }, []);

  return <div> {JSON.stringify(state)}</div>;
};
export const UpdateTodolistTitle = () => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {
    const todoId = 'abaaa46d-63af-4f10-8186-63affaee7b5c';
    const title = 'Angul';
    todolistAPI.updateTodolist(todoId, title).then((res) => setState(res.data));
  }, []);

  return <div> {JSON.stringify(state)}</div>;
};
