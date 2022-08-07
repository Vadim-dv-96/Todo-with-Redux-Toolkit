import { useEffect, useState } from 'react';
import { taskAPI } from '../api/task-api';
import { todolistAPI } from '../api/todolist-api';

export default {
  title: 'API',
};

export const GetTasks = () => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {
    const todolistId = 'abaaa46d-63af-4f10-8186-63affaee7b5c';
    taskAPI.getTasks(todolistId).then((res) => {
      setState(res.data);
    });
  }, []);

  return <div> {JSON.stringify(state)}</div>;
};
export const CreateTask = () => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {
    const todolistId = 'abaaa46d-63af-4f10-8186-63affaee7b5c';
    const title = 'task3';
    taskAPI.createTask(todolistId, title).then((res) => setState(res.data));
  }, []);

  return <div> {JSON.stringify(state)}</div>;
};
export const DeleteTask = () => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {
    const todoId = 'abaaa46d-63af-4f10-8186-63affaee7b5c';
    const taskId = '9c11c9ce-8489-4c77-9fad-d9cecc5d7974';
    taskAPI.deleteTask(todoId, taskId).then((res) => setState(res.data));
  }, []);

  return <div> {JSON.stringify(state)}</div>;
};
export const UpdateTaskTitle = () => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {
    const todoId = 'abaaa46d-63af-4f10-8186-63affaee7b5c';
    const taskId = 'd803b5fc-6373-4255-aafb-d88a9562366a';
    const title = 'GGGGGGGGG';
    taskAPI
      .updateTask(todoId, taskId, {
        deadline: '',
        description: '',
        priority: 0,
        startDate: '',
        status: 0,
        title: title,
      })
      .then((res) => setState(res.data));
  }, []);

  return <div> {JSON.stringify(state)}</div>;
};
