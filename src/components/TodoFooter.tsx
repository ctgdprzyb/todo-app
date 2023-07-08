import cn from 'classnames';
import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';
import { FilteringMode } from '../utils/FilteringMode';

interface Props {
  setFilteringMode: (arg0: FilteringMode) => void,
  filteringMode: FilteringMode,
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setTodosToBeEdited: React.Dispatch<React.SetStateAction<number[]>>,
}

export const TodoFooter: React.FC<Props>
  = ({
    setFilteringMode, filteringMode, todos, setTodos,
  }) => {
    const handleMassDeletion = () => {
      const completedTodos = todos.filter(todo => todo.completed);

      completedTodos.forEach(todo => setTodos(deleteTodo(todo.id)));
    };

    return (
      <footer className="todoapp__footer">
        <span className="todo-count">
          {todos.filter(todo => !todo.completed).length}
          {' '}
          items left
        </span>

        <nav className="filter">
          <a
            href="#/"
            className={cn({
              filter__link: true,
              selected: filteringMode === FilteringMode.all,
            })}
            onClick={() => setFilteringMode(FilteringMode.all)}
          >
            All
          </a>

          <a
            href="#/active"
            className={cn({
              filter__link: true,
              selected: filteringMode === FilteringMode.active,
            })}
            onClick={() => setFilteringMode(FilteringMode.active)}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={cn({
              filter__link: true,
              selected: filteringMode === FilteringMode.completed,
            })}
            onClick={() => setFilteringMode(FilteringMode.completed)}
          >
            Completed
          </a>
        </nav>

        <button
          type="button"
          className={cn({
            'todoapp__clear-completed': true,
            'todoapp__clear-completed__hidden':
              !todos.find(todo => todo.completed),
          })}
          onClick={handleMassDeletion}
        >
          Clear completed
        </button>
      </footer>
    );
  };
