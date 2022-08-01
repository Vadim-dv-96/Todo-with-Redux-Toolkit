import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AddItemForm } from '../components/AddItemForm';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Todolist/AddItemForm',
  component: AddItemForm,
  //   argTypes: { addItem: { action: 'clicked' } },
  argTypes: {
    addItem: { description: 'click' },
  },
} as ComponentMeta<typeof AddItemForm>;

const Template: ComponentStory<typeof AddItemForm> = (args) => <AddItemForm {...args} />;

export const AddItemFormStory = Template.bind({});

AddItemFormStory.args = {
  addItem: action('click addItem'),
};
