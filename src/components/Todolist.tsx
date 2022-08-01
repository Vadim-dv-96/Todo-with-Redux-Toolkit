import { Delete } from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';
import React from 'react';
import { useCallback } from 'react';
import { FilterValueType } from '../App';
import { AddItemForm } from './AddItemForm';
import { EditableSpan } from './EditableSpan';
import { Task } from './Task';

export const Todolist = React.memo(
  ({
    todoId,
    title,
    tasks,
    removeTask,
    changeTodoFilter,
    addTask,
    changeTaskStatus,
    changeTaskTitle,
    filter,
    removeTodolist,
    changeTodoTitle, //деструктеризация props, что бы убрать ошибки в зависимостях useCallback
  }: TodoPropsType) => {
    console.log('Todo render');

    const addTaskForItemForm = useCallback(
      (title: string) => {
        addTask(title, todoId);
      },
      [todoId, addTask]
    );
    const onAllClickHandler = useCallback(() => {
      changeTodoFilter(todoId, 'all');
    }, [changeTodoFilter, todoId]);

    const onActiveClickHandler = useCallback(() => {
      changeTodoFilter(todoId, 'active');
    }, [changeTodoFilter, todoId]);

    const onCompletedClickHandler = useCallback(() => {
      changeTodoFilter(todoId, 'completed');
    }, [changeTodoFilter, todoId]);

    const removeTodoHandler = () => {
      removeTodolist(todoId);
    };

    const changeTodoTitleHandler = useCallback(
      (title: string) => {
        changeTodoTitle(todoId, title);
      },
      [changeTodoTitle, todoId]
    );

    let tasksForTodolist = tasks;

    if (filter === 'active') {
      tasksForTodolist = tasks.filter((t) => {
        return t.isDone === false;
      });
    }
    if (filter === 'completed') {
      tasksForTodolist = tasks.filter((t) => {
        return t.isDone === true;
      });
    }
    return (
      <div>
        <h3>
          <EditableSpan value={title} onChange={changeTodoTitleHandler} />
          <IconButton size="medium" color="secondary" onClick={removeTodoHandler}>
            <Delete fontSize="small" />
          </IconButton>
        </h3>

        <AddItemForm addItem={addTaskForItemForm} />
        <div>
          {tasksForTodolist.map((t) => {
            return <Task key={t.id} todoId={todoId} task={t} removeTask={removeTask} changeTaskStatus={changeTaskStatus} changeTaskTitle={changeTaskTitle} />;
          })}
        </div>
        <div style={{ paddingTop: '10px' }}>
          <Button onClick={onAllClickHandler} variant={filter === 'all' ? 'outlined' : 'text'}>
            All
          </Button>
          <Button color="error" onClick={onActiveClickHandler} variant={filter === 'active' ? 'outlined' : 'text'}>
            Active
          </Button>
          <Button color="secondary" onClick={onCompletedClickHandler} variant={filter === 'completed' ? 'outlined' : 'text'}>
            Complited
          </Button>
        </div>
      </div>
    );
  }
);

//types
export type TaskType = {
  id: string;
  title: string;
  isDone: boolean;
};

type TodoPropsType = {
  todoId: string;
  title: string;
  tasks: Array<TaskType>;
  removeTask: (todoId: string, id: string) => void;
  changeTaskStatus: (taskId: string, newTaskStatus: boolean, todoId: string) => void;
  changeTaskTitle: (todoId: string, taskId: string, newTitle: string) => void;
  changeTodoFilter: (todoId: string, value: FilterValueType) => void;
  addTask: (taskTitle: string, todoId: string) => void;
  filter: FilterValueType;
  removeTodolist: (todoId: string) => void;
  changeTodoTitle: (todoId: string, newTitle: string) => void;
};
