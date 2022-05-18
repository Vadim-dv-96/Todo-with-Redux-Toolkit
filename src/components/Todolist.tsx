import { ChangeEvent, useState } from 'react';
import { FilterValueType } from '../App';

export type TaskType = {
  id: string;
  title: string;
  isDone: boolean;
};

type TodoPropsType = {
  todoId: string;
  title: string;
  tasks: Array<TaskType>;
  removeTask: (id: string, todoId: string) => void;
  changeFilter: (value: FilterValueType, todoId: string) => void;
  addTask: (taskName: string, todoId: string) => void;
  changeTaskStatus: (taskId: string, newTaskStatus: boolean, todoId: string) => void;
  filter: FilterValueType;
  removeTodolist: (todoId: string) => void;
};

export const Todolist = (props: TodoPropsType) => {
  const [taskName, setTaskName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const addTaskHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTaskName(e.currentTarget.value);
  };
  const addTask = () => {
    if (taskName.trim() !== '') {
      props.addTask(taskName.trim(), props.todoId);
      setTaskName('');
    } else {
      setError('Title is required');
    }
  };

  const onKeyPressHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setError(null);
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const onAllClickHandler = () => {
    props.changeFilter('all', props.todoId);
  };
  const onActiveClickHandler = () => {
    props.changeFilter('active', props.todoId);
  };
  const onCompletedClickHandler = () => {
    props.changeFilter('complited', props.todoId);
  };

  const removeTodoHandler = () => {
    props.removeTodolist(props.todoId);
  };

  return (
    <div className="Todo">
      <h3>
        {props.title} <button onClick={removeTodoHandler}>x</button>
      </h3>

      <div>
        <input
          value={taskName}
          onChange={addTaskHandler}
          onKeyPress={onKeyPressHandler}
          className={error ? 'error' : ''}
        />
        <button onClick={addTask}>+</button>
        {error && <div className="error-message"> {error} </div>}
      </div>
      <ul>
        {props.tasks.map((t) => {
          const removeTaskHandler = () => {
            props.removeTask(t.id, props.todoId);
          };

          const onChangeСheckboxHandler = (e: ChangeEvent<HTMLInputElement>) => {
            const newIsDoneValue = e.currentTarget.checked;
            props.changeTaskStatus(t.id, newIsDoneValue, props.todoId);
          };

          return (
            <li key={t.id} className={t.isDone ? 'is-done' : ''}>
              <input type="checkbox" checked={t.isDone} onChange={onChangeСheckboxHandler} />
              <span> {t.title} </span>
              <button onClick={removeTaskHandler}>x</button>
            </li>
          );
        })}
      </ul>
      <div>
        <button onClick={onAllClickHandler} className={props.filter === 'all' ? 'active-filter' : ''}>
          All
        </button>
        <button onClick={onActiveClickHandler} className={props.filter === 'active' ? 'active-filter' : ''}>
          Active
        </button>
        <button onClick={onCompletedClickHandler} className={props.filter === 'complited' ? 'active-filter' : ''}>
          Complited
        </button>
      </div>
    </div>
  );
};
