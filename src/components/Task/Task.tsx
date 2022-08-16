import { Delete } from '@mui/icons-material';
import { Checkbox, IconButton } from '@mui/material';
import React, { useCallback } from 'react';
import { ChangeEvent } from 'react';
import { RequestStatusType } from '../../api/app-reducer';
import { TaskStatuses, TaskType } from '../../api/task-api';
import { EditableSpan } from '../EditableSpan';

//types
export type TaskPropsType = {
  todoId: string;
  task: TaskType;
  removeTask: (todoId: string, id: string) => void;
  changeTaskStatus: (taskId: string, status: TaskStatuses, todoId: string) => void;
  changeTaskTitle: (todoId: string, taskId: string, newTitle: string) => void;
  entityStatus: RequestStatusType;
  entityTaskStatus: RequestStatusType;
};

export const Task = React.memo((props: TaskPropsType) => {
  const removeTaskHandler = () => {
    props.removeTask(props.todoId, props.task.id);
  };

  const onChangeСheckboxHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const newIsDoneValue = e.currentTarget.checked;
    props.changeTaskStatus(props.task.id, newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New, props.todoId);
  };

  const onChangeInputHandler = useCallback(
    (title: string) => {
      props.changeTaskTitle(props.todoId, props.task.id, title);
    },
    [props.changeTaskTitle, props.task.id]
  );
  return (
    <div key={props.task.id} style={{ paddingTop: '5px' }}>
      <Checkbox
        disabled={props.entityTaskStatus === 'loading'}
        size="small"
        color="secondary"
        checked={props.task.status === TaskStatuses.Completed}
        onChange={onChangeСheckboxHandler}
      />

      <EditableSpan entityStatus={props.entityStatus} value={props.task.title} onChange={onChangeInputHandler} />

      <IconButton disabled={props.entityTaskStatus === 'loading'} size="medium" color="secondary" onClick={removeTaskHandler}>
        <Delete fontSize="small" />
      </IconButton>
    </div>
  );
});
