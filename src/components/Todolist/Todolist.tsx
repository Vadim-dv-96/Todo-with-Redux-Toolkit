import { Delete } from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';
import React from 'react';
import { useCallback } from 'react';
import { TaskStatuses } from '../../api/task-api';
import { TaskDomainType } from '../../state/tasks-reducer';
import { FilterValueType, TodolistDomainType } from '../../state/todolists-reducer';
import { AddItemForm } from '../AddItemForm';
import { EditableSpan } from '../EditableSpan';
import { Task } from '../Task/Task';

export const Todolist = React.memo(
  ({
    demo = false,
    todo, //весь тудулист
    tasks,
    removeTask,
    changeTodoFilter,
    addTask,
    changeTaskStatus,
    changeTaskTitle,
    removeTodolist,
    changeTodoTitle, //деструктеризация props, что бы убрать ошибки в зависимостях useCallback
  }: TodoPropsType) => {
    // useEffect(() => {
    //   if (!demo) {
    //     dispatch(getTasksTC(todo.id));
    //   }
    // }, [dispatch, todo.id]);

    const addTaskForItemForm = useCallback(
      (title: string) => {
        addTask(title, todo.id);
      },
      [todo.id, addTask]
    );
    const onAllClickHandler = useCallback(() => {
      changeTodoFilter(todo.id, 'all');
    }, [changeTodoFilter, todo.id]);

    const onActiveClickHandler = useCallback(() => {
      changeTodoFilter(todo.id, 'active');
    }, [changeTodoFilter, todo.id]);

    const onCompletedClickHandler = useCallback(() => {
      changeTodoFilter(todo.id, 'completed');
    }, [changeTodoFilter, todo.id]);

    const removeTodoHandler = () => {
      removeTodolist(todo.id);
    };

    const changeTodoTitleHandler = useCallback(
      (title: string) => {
        changeTodoTitle(todo.id, title);
      },
      [changeTodoTitle, todo.id]
    );

    let tasksForTodolist = tasks;

    if (todo.filter === 'active') {
      tasksForTodolist = tasks.filter((t) => {
        return t.status === TaskStatuses.New;
      });
    }
    if (todo.filter === 'completed') {
      tasksForTodolist = tasks.filter((t) => {
        return t.status === TaskStatuses.Completed;
      });
    }
    return (
      <div>
        <h3>
          <EditableSpan entityStatus={todo.entityStatus} value={todo.title} onChange={changeTodoTitleHandler} />
          <IconButton
            disabled={todo.entityStatus === 'loading'}
            size="medium"
            color="secondary"
            onClick={removeTodoHandler}
          >
            <Delete fontSize="small" />
          </IconButton>
        </h3>

        <AddItemForm addItem={addTaskForItemForm} entityStatus={todo.entityStatus} />
        <div>
          {tasksForTodolist.map((t) => {
            return (
              <Task
                entityStatus={todo.entityStatus}
                key={t.id}
                todoId={todo.id}
                task={t}
                removeTask={removeTask}
                changeTaskStatus={changeTaskStatus}
                changeTaskTitle={changeTaskTitle}
              />
            );
          })}
        </div>
        <div style={{ paddingTop: '10px' }}>
          <Button onClick={onAllClickHandler} variant={todo.filter === 'all' ? 'outlined' : 'text'}>
            All
          </Button>
          <Button color="error" onClick={onActiveClickHandler} variant={todo.filter === 'active' ? 'outlined' : 'text'}>
            Active
          </Button>
          <Button
            color="secondary"
            onClick={onCompletedClickHandler}
            variant={todo.filter === 'completed' ? 'outlined' : 'text'}
          >
            Completed
          </Button>
        </div>
      </div>
    );
  }
);

//types
type TodoPropsType = {
  demo?: boolean;
  todo: TodolistDomainType;
  tasks: Array<TaskDomainType>;
  removeTask: (todoId: string, id: string) => void;
  changeTaskStatus: (taskId: string, status: TaskStatuses, todoId: string) => void;
  changeTaskTitle: (todoId: string, taskId: string, newTitle: string) => void;
  changeTodoFilter: (todoId: string, value: FilterValueType) => void;
  addTask: (taskTitle: string, todoId: string) => void;
  removeTodolist: (todoId: string) => void;
  changeTodoTitle: (todoId: string, newTitle: string) => void;
};
