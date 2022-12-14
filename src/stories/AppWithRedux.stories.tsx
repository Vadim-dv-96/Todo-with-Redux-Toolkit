import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import AppWithRedux from '../AppWithRedux';
import { ReduxStoreProviderDecorator } from '../state/ReduxStoreProviderDecorator';

export default {
  title: 'Todolist/AppWithRedux',
  component: AppWithRedux,
  decorators: [ReduxStoreProviderDecorator],
} as ComponentMeta<typeof AppWithRedux>;

const Template: ComponentStory<typeof AppWithRedux> = (args) => (
  <MemoryRouter>
    <AppWithRedux {...args} />
  </MemoryRouter>
);

export const AppWithReduxStory = Template.bind({});
AppWithReduxStory.args = {
  demo: true,
};
