import { ChangeEvent } from 'react';

type InputPropsType = {
  setTitle: (title: string) => void;
  title: string;
};

export const Input = (props: InputPropsType) => {
  const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    props.setTitle(e.currentTarget.value);
  };
  return (
    <div>
      <input value={props.title} onChange={inputHandler} />
    </div>
  );
};
