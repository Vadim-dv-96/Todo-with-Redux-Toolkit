import { ChangeEvent, useState } from 'react';

type FullInputPropsType = {
  addMessage: (title: string) => void;
};

export const FullInput = (props: FullInputPropsType) => {
  const [title, setTitle] = useState('');

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };

  const onClickHendler = () => {
    props.addMessage(title);
    setTitle('');
  };

  return (
    <div>
      <input value={title} onChange={changeHandler} />
      <button onClick={onClickHendler}>+</button>
    </div>
  );
};
