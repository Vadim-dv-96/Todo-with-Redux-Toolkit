import { Delete } from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';
import React from 'react';
import { useCallback } from 'react';
import { FilterValueType } from '../App';
import { AddItemForm } from './AddItemForm';
import { EditableSpan } from './EditableSpan';
import { Task } from './Task';

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
  changeTodoFilter: (todoId: string, value: FilterValueType) => void;
  addTask: (taskTitle: string, todoId: string) => void;
  changeTaskStatus: (taskId: string, newTaskStatus: boolean, todoId: string) => void;
  changeTaskTitle: (todoId: string, taskId: string, newTitle: string) => void;
  filter: FilterValueType;
  removeTodolist: (todoId: string) => void;
  changeTodoTitle: (todoId: string, newTitle: string) => void;
};

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
    console.log('Todolist called');
    const addTaskItemForm = useCallback(
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

    const changeTodoTitleHandler = (title: string) => {
      changeTodoTitle(todoId, title);
    };

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

    const removeTaskForComponentTask = useCallback(
      (taskId: string) => {
        removeTask(todoId, taskId);
      },
      [removeTask, todoId]
    );

    const changeTaskStatusForComponentTask = useCallback(
      (taskId: string, newIsDoneValue: boolean) => {
        changeTaskStatus(taskId, newIsDoneValue, todoId);
      },
      [changeTaskStatus, todoId]
    );

    const changeTaskTitleForComponentTask = useCallback(
      (taskId: string, title: string) => {
        changeTaskTitle(todoId, taskId, title);
      },
      [changeTaskTitle, todoId]
    );

    return (
      <div>
        <h3>
          <EditableSpan value={title} onChange={changeTodoTitleHandler} />
          <IconButton size="medium" color="secondary" onClick={removeTodoHandler}>
            <Delete fontSize="small" />
          </IconButton>
        </h3>

        <AddItemForm addItem={addTaskItemForm} />
        <div>
          {tasksForTodolist.map((t) => {
            return (
              <Task
                key={t.id}
                task={t}
                removeTask={removeTaskForComponentTask}
                changeTaskStatus={changeTaskStatusForComponentTask}
                changeTaskTitle={changeTaskTitleForComponentTask}
              />
            );
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
