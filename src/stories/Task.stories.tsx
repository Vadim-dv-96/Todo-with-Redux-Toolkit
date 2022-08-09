import { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Task } from '../components/Task';
import { TaskPriorities, TaskStatuses } from '../api/task-api';

export default {
  title: 'Todolist/Task',
  component: Task,
  args: {
    todoId: '34dg',
    removeTask: action('click removeTask'),
    changeTaskStatus: action('click changeTaskStatus'),
    changeTaskTitle: action('click changeTaskTitle'),
  },
} as ComponentMeta<typeof Task>;

const Template: ComponentStory<typeof Task> = (args) => <Task {...args} />;

export const TaskIsDoneStory = Template.bind({});
TaskIsDoneStory.args = {
  task: {
    id: '24t',
    title: 'JS',
    status: TaskStatuses.Completed,
    todoListId: 'todolistId1',
    addedDate: '',
    deadline: '',
    startDate: '',
    order: 0,
    priority: TaskPriorities.Low,
    description: '',
  },
};

export const TaskIsNotDoneStory = Template.bind({});
TaskIsNotDoneStory.args = {
  task: {
    id: '28tf6',
    title: 'HTML',
    status: TaskStatuses.New,
    todoListId: 'todolistId1',
    addedDate: '',
    deadline: '',
    startDate: '',
    order: 0,
    priority: TaskPriorities.Low,
    description: '',
  },
};
