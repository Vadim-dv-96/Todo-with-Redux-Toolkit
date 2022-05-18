import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './AppExample';

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

test('filter completed tasks', () => {
  const tasks = [
    { id: 1, title: 'Milk', isDone: true },
    { id: 2, title: 'Bread', isDone: true },
    { id: 3, title: 'Solt', isDone: false },
    { id: 4, title: 'Sugar', isDone: false },
  ];

  const filteredTasks = tasks.filter((tasks) => {
    return tasks.isDone;
  });

  expect(filteredTasks.length).toBe(2);
  expect(filteredTasks[0].title).toBe('Milk');
  expect(filteredTasks[1].title).toBe('Bread');
  expect(filteredTasks[0].id).toBe(1);
  expect(filteredTasks[1].id).toBe(2);
});
