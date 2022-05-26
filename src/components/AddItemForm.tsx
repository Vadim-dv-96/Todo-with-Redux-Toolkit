import { Button, TextField } from '@mui/material';
import { ChangeEvent, useState } from 'react';

export type AddItemFormPropsType = {
  addItem: (title: string) => void;
};

export const AddItemForm = (props: AddItemFormPropsType) => {
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
      setError('Task name is required');
    }
  };

  const onKeyPressHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setError(null);
    if (e.key === 'Enter') {
      addItemHandler();
    }
  };
  return (
    <div>
      <TextField
        size="small"
        label="Enter task name"
        variant="outlined"
        color="secondary"
        value={taskTitle}
        onChange={inputHandler}
        onKeyPress={onKeyPressHandler}
        error={!!error}
        helperText={error}
      />
      <Button variant="contained" color="secondary" onClick={addItemHandler}>
        +
      </Button>
    </div>
  );
};
