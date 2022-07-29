import { Delete } from '@mui/icons-material';
import { Checkbox, IconButton } from '@mui/material';
import React from 'react';
import { ChangeEvent } from 'react';
import { EditableSpan } from './EditableSpan';
import { TaskType } from './Todolist';

export const Task = React.memo((props: TaskPropsType) => {
  console.log('Task render');

  const removeTaskHandler = () => {
    props.removeTask(props.task.id);
  };

  const onChangeСheckboxHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const newIsDoneValue = e.currentTarget.checked;
    props.changeTaskStatus(props.task.id, newIsDoneValue);
  };

  const onChangeInputHandler = (title: string) => {
    props.changeTaskTitle(props.task.id, title);
  };

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

//types
export type TaskPropsType = {
  task: TaskType;
  removeTask: (taskId: string) => void;
  changeTaskStatus: (taskId: string, newIsDoneValue: boolean) => void;
  changeTaskTitle: (taskId: string, title: string) => void;
};
