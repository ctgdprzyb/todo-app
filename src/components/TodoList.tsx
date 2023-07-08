import cn from 'classnames';
import { useContext, useState } from 'react';
import { Todo } from '../types/Todo';
import {
  addTodo, deleteTodo, patchTodo,
} from '../api/todos';
import { SetErrorContext } from '../utils/setErrorContext';
import { ErrorMessage } from '../utils/ErrorMessage';
import { FilteringMode } from '../utils/FilteringMode';

interface Props {
  todos: Todo[],
  filteringMode: FilteringMode,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  todosToBeEdited: Todo['id'][] | null,
  setTodosToBeEdited: React.Dispatch<React.SetStateAction<number[]>>,
}

let filteredTodos: Todo[] = [];

export const TodoList: React.FC<Props> = ({
  todos, filteringMode, setTodos, todosToBeEdited,
}) => {
  const [todoTitle, setTodoTitle] = useState('');
  const [processing] = useState(false);
  const [tempTodo] = useState<Todo | null>(null);
  const [editTodoTitle, setEditTodoTitle] = useState<Todo | null>(null);

  if (filteringMode !== FilteringMode.all && todos) {
    switch (filteringMode) {
      case FilteringMode.active:
        filteredTodos = todos.filter(todo => !todo.completed);
        break;
      case FilteringMode.completed:
        filteredTodos = todos.filter(todo => todo.completed);
        break;
      default:
    }
  } else {
    filteredTodos = todos;
  }

  const setError = useContext(SetErrorContext);

  const handleSubmitNewTodo = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (todoTitle) {
        setTodos(addTodo({
          title: todoTitle,
          completed: false,
        }));

        setTodoTitle('');
      } else {
        setError?.(ErrorMessage.EmptyTitle);
      }
    }
  };

  const handleActiveToggle = (todo: Todo) => {
    setTodos(patchTodo(todo.id, { completed: !todo.completed }));
  };

  const handleMassActiveToggle = () => {
    if (todos.every(todo => todo.completed)) {
      todos.forEach(todo => setTodos(patchTodo(todo.id, {
        ...todo,
        completed: false,
      })));
    } else {
      const unfinishedTodos = todos.filter(todo => !todo.completed);

      unfinishedTodos.forEach(todo => setTodos(patchTodo(todo.id, {
        ...todo,
        completed: true,
      })));
    }
  };

  const handleDeletion = (todoId: number) => {
    if (todos) {
      setTodos(deleteTodo(todoId));
    }
  };

  const handleTodoNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (editTodoTitle !== null) {
      setEditTodoTitle({
        id: editTodoTitle.id,
        completed: editTodoTitle.completed,
        title: event.target.value,
      });
    }
  };

  const handleFinishTodoNameChange = (todo: Todo) => {
    if (editTodoTitle) {
      if (editTodoTitle.title === todo.title) {
        setEditTodoTitle(null);
      } else if (!editTodoTitle.title) {
        handleDeletion(todo.id);
      } else {
        setTodos(patchTodo(editTodoTitle.id, { title: editTodoTitle.title }));
        setEditTodoTitle(null);
      }
    }
  };

  const handleOnKeyUp = (
    event: React.KeyboardEvent<HTMLElement>,
  ) => {
    if (event.key === 'Escape') {
      setEditTodoTitle(null);
    }
  };

  const handleSubmitEditedTodo = (
    event: React.FormEvent<HTMLFormElement>, todo: Todo,
  ) => {
    event.preventDefault();
    handleFinishTodoNameChange(todo);
  };

  return (
    <>
      <header className="todoapp__header">
        {/* this buttons is active only if there are some active todos */}
        <button
          type="button"
          className={cn({
            'todoapp__toggle-all': true,
            active: !todos.find(todo => !todo.completed),
          })}
          aria-label="Toggle all"
          onClick={handleMassActiveToggle}
        />

        <form>
          <input
            data-cy="createTodo"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={todoTitle}
            onChange={(event) => setTodoTitle(event.target.value)}
            onKeyDown={handleSubmitNewTodo}
            disabled={processing}
          />
        </form>
      </header>

      <section className="todoapp__main">
        {filteredTodos.map((todo) => (
          <div
            className={cn({
              todo: true,
              completed: todo.completed,
            })}
            key={todo.id}
          >
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
                defaultChecked={todo.completed}
                onClick={() => handleActiveToggle(todo)}
              />
            </label>

            {editTodoTitle !== null && editTodoTitle.id === todo.id
              ? (
                <form onSubmit={(event) => handleSubmitEditedTodo(event, todo)}>
                  <input
                    type="text"
                    className="todo__title-field"
                    placeholder="Empty todo will be deleted"
                    value={editTodoTitle.title}
                    onBlur={() => handleFinishTodoNameChange(todo)}
                    onChange={(event) => handleTodoNameChange(event)}
                    onKeyDown={(event) => handleOnKeyUp(event)}
                    // eslint-disable-next-line jsx-a11y/no-autofocus
                    autoFocus
                  />
                </form>
              )
              : (
                <span
                  className="todo__title"
                  onDoubleClick={() => setEditTodoTitle(todo)}
                >
                  {todo.title}
                </span>
              )}

            {!(editTodoTitle?.id === todo.id) && (
              <button
                type="button"
                className="todo__remove"
                onClick={() => handleDeletion(todo.id)}
              >
                ×
              </button>
            )}

            <div className={
              todosToBeEdited?.includes(todo.id)
                ? 'modal overlay is-active'
                : 'modal overlay'
            }
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        ))}

        {tempTodo
        && (
          <div className="todo">
            <label className="todo__status-label">
              <input type="checkbox" className="todo__status" />
            </label>

            <span className="todo__title">{tempTodo.title}</span>
            <button type="button" className="todo__remove">×</button>

            <div className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )}
      </section>
    </>
  );
};
