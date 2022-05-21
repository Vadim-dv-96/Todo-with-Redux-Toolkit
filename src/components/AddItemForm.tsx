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
      setError('Title is required');
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
      <input
        value={taskTitle}
        onChange={inputHandler}
        onKeyPress={onKeyPressHandler}
        className={error ? 'error' : ''}
      />
      <button onClick={addItemHandler}>+</button>
      {error && <div className="error-message"> {error} </div>}
    </div>
  );
};
