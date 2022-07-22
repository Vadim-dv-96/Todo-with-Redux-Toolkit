import { Delete } from '@mui/icons-material';
import { Button, Checkbox, IconButton } from '@mui/material';
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
  removeTask: (todoId: string, id: string) => void;
  changeTodoFilter: (todoId: string, value: FilterValueType) => void;
  addTask: (taskTitle: string, todoId: string) => void;
  changeTaskStatus: (taskId: string, newTaskStatus: boolean, todoId: string) => void;
  changeTaskTitle: (todoId: string, taskId: string, newTitle: string) => void;
  filter: FilterValueType;
  removeTodolist: (todoId: string) => void;
  changeTodoTitle: (todoId: string, newTitle: string) => void;
};

export const Todolist = (props: TodoPropsType) => {
  const addTask = (title: string) => {
    props.addTask(title, props.todoId);
  };

  const onAllClickHandler = () => {
    props.changeTodoFilter(props.todoId, 'all');
  };
  const onActiveClickHandler = () => {
    props.changeTodoFilter(props.todoId, 'active');
  };
  const onCompletedClickHandler = () => {
    props.changeTodoFilter(props.todoId, 'completed');
  };

  const removeTodoHandler = () => {
    props.removeTodolist(props.todoId);
  };

  const changeTodoTitleHandler = (title: string) => {
    props.changeTodoTitle(props.todoId, title);
  };

  return (
    <div>
      <h3>
        <EditableSpan value={props.title} onChange={changeTodoTitleHandler} />
        <IconButton size="medium" color="secondary" onClick={removeTodoHandler}>
          <Delete fontSize="small" />
        </IconButton>
      </h3>

      <AddItemForm addItem={addTask} />
      <div>
        {props.tasks.map((t) => {
          const removeTaskHandler = () => {
            props.removeTask(props.todoId, t.id);
          };

          const onChangeСheckboxHandler = (e: ChangeEvent<HTMLInputElement>) => {
            const newIsDoneValue = e.currentTarget.checked;
            props.changeTaskStatus(t.id, newIsDoneValue, props.todoId);
          };

          const onChangeInputHandler = (title: string) => {
            props.changeTaskTitle(props.todoId, t.id, title);
          };

          return (
            <div key={t.id} style={{ paddingTop: '5px' }}>
              <Checkbox size="small" color="secondary" checked={t.isDone} onChange={onChangeСheckboxHandler} />

              <EditableSpan value={t.title} onChange={onChangeInputHandler} />

              <IconButton size="medium" color="secondary" onClick={removeTaskHandler}>
                <Delete fontSize="small" />
              </IconButton>
            </div>
          );
        })}
      </div>
      <div style={{ paddingTop: '10px' }}>
        <Button onClick={onAllClickHandler} variant={props.filter === 'all' ? 'outlined' : 'text'}>
          All
        </Button>
        <Button color="error" onClick={onActiveClickHandler} variant={props.filter === 'active' ? 'outlined' : 'text'}>
          Active
        </Button>
        <Button
          color="secondary"
          onClick={onCompletedClickHandler}
          variant={props.filter === 'completed' ? 'outlined' : 'text'}
        >
          Complited
        </Button>
      </div>
    </div>
  );
};
