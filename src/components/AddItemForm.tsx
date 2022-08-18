import { Button, TextField } from '@mui/material';
import React from 'react';
import { ChangeEvent, useState } from 'react';
import { RequestStatusType } from '../state/app-reducer';

//types
export type AddItemFormPropsType = {
  addItem: (title: string) => void;
  entityStatus?: RequestStatusType;
};

export const AddItemForm = React.memo((props: AddItemFormPropsType) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTaskTitle(e.currentTarget.value);
  };
  const addItemHandler = () => {
    if (taskTitle.trim() !== '') {
      props.addItem(taskTitle.trim());
      setTaskTitle('');
    } else {
      setError('Name is required');
    }
  };

  const onKeyPressHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (error) setError(null);
    if (e.key === 'Enter') {
      addItemHandler();
    }
  };
  return (
    <div>
      <TextField
        size="small"
        label="Enter name"
        variant="outlined"
        color="secondary"
        value={taskTitle}
        onChange={inputHandler}
        onKeyPress={onKeyPressHandler}
        error={!!error}
        helperText={error}
        disabled={props.entityStatus === 'loading'}
      />
      <Button disabled={props.entityStatus === 'loading'} variant="contained" color="secondary" onClick={addItemHandler}>
        +
      </Button>
    </div>
  );
});
