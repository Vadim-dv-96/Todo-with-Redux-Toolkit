import { Delete } from '@mui/icons-material';
import { Checkbox, IconButton } from '@mui/material';
import React, { useCallback } from 'react';
import { ChangeEvent } from 'react';
import { EditableSpan } from './EditableSpan';
import { TaskType } from './Todolist';

//types
export type TaskPropsType = {
  todoId: string;
  task: TaskType;
  removeTask: (todoId: string, id: string) => void;
  changeTaskStatus: (taskId: string, newTaskStatus: boolean, todoId: string) => void;
  changeTaskTitle: (todoId: string, taskId: string, newTitle: string) => void;
};

export const Task = React.memo((props: TaskPropsType) => {
  const removeTaskHandler = () => {
    props.removeTask(props.todoId, props.task.id);
  };

  const onChangeСheckboxHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const newIsDoneValue = e.currentTarget.checked;
    props.changeTaskStatus(props.task.id, newIsDoneValue, props.todoId);
  };

  const onChangeInputHandler = useCallback(
    (title: string) => {
      props.changeTaskTitle(props.todoId, props.task.id, title);
    },
    [props.changeTaskTitle, props.task.id]
  );

  return (
    <div key={props.task.id} style={{ paddingTop: '5px' }}>
      <Checkbox size="small" color="secondary" checked={props.task.isDone} onChange={onChangeСheckboxHandler} />

      <EditableSpan value={props.task.title} onChange={onChangeInputHandler} />

      <IconButton size="medium" color="secondary" onClick={removeTaskHandler}>
        <Delete fontSize="small" />
      </IconButton>
    </div>
  );
});
