import { useState } from 'react';
import './AppExample.css';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

function App() {
  const [message, setMessage] = useState([{ message: 'message 1' }, { message: 'message 2' }, { message: 'message 3' }]);

  const addMessage = (title: string) => {
    setMessage([{ message: title }, ...message]);
  };

  const [title, setTitle] = useState('');

  const callbackHandler = () => {
    addMessage(title);
    setTitle('');
  };

  return (
    <div className="App">
      <Input setTitle={setTitle} title={title} />
      <Button name="+" callback={callbackHandler} />
      {message.map((m, i) => {
        return <div key={i}> {m.message} </div>;
      })}
    </div>
  );
}

export default App;
