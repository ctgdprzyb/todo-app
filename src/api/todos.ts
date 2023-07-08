import { Todo } from '../types/Todo';

export const getTodos = () => {
  const value = localStorage.getItem('todos');

  if (typeof value === 'string') {
    return JSON.parse(value);
  }

  return [];
};

export const addTodo = (todo: Omit<Todo, 'id'>) => {
  const value = localStorage.getItem('todos');
  let todos;
  const newTodo = {
    ...todo,
    id: +new Date(),
  };

  if (typeof value === 'string') {
    todos = JSON.parse(value);
    todos.push(newTodo);
  } else {
    todos = [newTodo];
  }

  localStorage.setItem('todos', JSON.stringify(todos));

  return todos;
};

export const deleteTodo = (todoId: number) => {
  const value = localStorage.getItem('todos');
  let todos;

  if (typeof value === 'string') {
    todos = JSON.parse(value).filter((todo: Todo) => todo.id !== todoId);
  }

  localStorage.setItem('todos', JSON.stringify(todos));

  return todos;
};

export const patchTodo = (todoId: number, data: object) => {
  const value = localStorage.getItem('todos');
  let todos;

  if (typeof value === 'string') {
    todos = JSON.parse(value);
  }

  const todoIndex = todos.findIndex((todo: Todo) => todo.id === todoId);

  todos[todoIndex] = {
    ...todos[todoIndex],
    ...data,
  };

  localStorage.setItem('todos', JSON.stringify(todos));

  return todos;
};
