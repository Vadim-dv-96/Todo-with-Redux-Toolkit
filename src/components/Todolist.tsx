import { ChangeEvent } from 'react';
import { FilterValueType } from '../App';
import { AddItemForm } from './AddItemForm';
import { EditableSpan } from './EditableSpan';

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
  addTask: (taskTitle: string, todoId: string) => void;
  changeTaskStatus: (taskId: string, newTaskStatus: boolean, todoId: string) => void;
  changeTaskTitle: (title: string, todoId: string, taskId: string) => void;
  filter: FilterValueType;
  removeTodolist: (todoId: string) => void;
  changeTodoTitle: (newTitle: string, todoId: string) => void;
};

export const Todolist = (props: TodoPropsType) => {
  const addTask = (title: string) => {
    props.addTask(title, props.todoId);
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

  const changeTodoTitleHandler = (title: string) => {
    props.changeTodoTitle(title, props.todoId);
  };

  return (
    <div className="Todo">
      <h3>
        <EditableSpan value={props.title} onChange={changeTodoTitleHandler} />
        <button onClick={removeTodoHandler}>x</button>
      </h3>

      <AddItemForm addItem={addTask} />
      <ul>
        {props.tasks.map((t) => {
          const removeTaskHandler = () => {
            props.removeTask(t.id, props.todoId);
          };

          const onChangeСheckboxHandler = (e: ChangeEvent<HTMLInputElement>) => {
            const newIsDoneValue = e.currentTarget.checked;
            props.changeTaskStatus(t.id, newIsDoneValue, props.todoId);
          };

          const onChangeInputHandler = (title: string) => {
            props.changeTaskTitle(title, props.todoId, t.id);
          };

          return (
            <li key={t.id} className={t.isDone ? 'is-done' : ''}>
              <input type="checkbox" checked={t.isDone} onChange={onChangeСheckboxHandler} />
              <EditableSpan value={t.title} onChange={onChangeInputHandler} />
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
