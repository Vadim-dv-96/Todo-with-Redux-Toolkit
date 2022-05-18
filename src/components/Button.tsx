type ButtonPropsType = {
  name: string;
  callback: () => void;
};

export const Button = (props: ButtonPropsType) => {
  const buttonHandler = () => {
    props.callback();
  };

  return (
    <div>
      <button onClick={buttonHandler}>{props.name}</button>
    </div>
  );
};
