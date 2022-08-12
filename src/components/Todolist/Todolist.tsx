import { Delete } from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';
import React, { useEffect } from 'react';
import { useCallback } from 'react';
import { TaskStatuses, TaskType } from '../../api/task-api';
import { useAppDispatch } from '../../hooks/hooks';
import { getTasksTC } from '../../state/tasks-reducer';
import { FilterValueType } from '../../state/todolists-reducer';
import { AddItemForm } from '../AddItemForm';
import { EditableSpan } from '../EditableSpan';
import { Task } from '../Task/Task';

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
    const dispatch = useAppDispatch();

    useEffect(() => {
      dispatch(getTasksTC(todoId));
    }, [dispatch, todoId]);

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
        return t.status === TaskStatuses.New;
      });
    }
    if (filter === 'completed') {
      tasksForTodolist = tasks.filter((t) => {
        return t.status === TaskStatuses.Completed;
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
            Completed
          </Button>
        </div>
      </div>
    );
  }
);

//types
type TodoPropsType = {
  todoId: string;
  title: string;
  tasks: Array<TaskType>;
  removeTask: (todoId: string, id: string) => void;
  changeTaskStatus: (taskId: string, status: TaskStatuses, todoId: string) => void;
  changeTaskTitle: (todoId: string, taskId: string, newTitle: string) => void;
  changeTodoFilter: (todoId: string, value: FilterValueType) => void;
  addTask: (taskTitle: string, todoId: string) => void;
  filter: FilterValueType;
  removeTodolist: (todoId: string) => void;
  changeTodoTitle: (todoId: string, newTitle: string) => void;
};
