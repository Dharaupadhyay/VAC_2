import {useState} from 'react';
import './App.css';

function App(){
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [filter, setFilter] = useState('All');
  const [editIndex, setEditIndex] = useState(null);
  const [editTask, setEditTask] = useState('');

  //add new task
  const handlesubmit = (e) => {
    e.preventDefault();

    const title = task.trim();
    if(!title) return;

    const newTodo = {
      id: Date.now(),
      title,
      completed: false
    };

    setTodos((prev) => [...prev, newTodo]);
    setTask('');
  };

  //mark task Completed or incomplete
  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  };

  //delete task
  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));

    if (editIndex === id) {
      setEditIndex(null);
      setEditTask('');
    }
  };

  //start editing a task
  const startEdit = (todo) => {
    setEditIndex(todo.id);
    setEditTask(todo.title);
  };

  //save edited task
  const saveEdit = (e) => {
    e.preventDefault();
      
    const title = editTask.trim();
    if (!title) return;

    setTodos((prev) =>
      prev.map((todo) => (todo.id === editIndex ? { ...todo, title } : todo))
    );
    setEditIndex(null);
    setEditTask('');
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'Active') return !todo.completed;
    if (filter === 'Completed') return todo.completed;
    return true;
  });

  return (
    <main>
      <h1>To Do List</h1>
      <form onSubmit={handlesubmit}>
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Add a task"
        />
        <button type="submit">Add</button>
      </form>

      <label>
        Show{' '}
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>All</option>
          <option>Active</option>
          <option>Completed</option>
        </select>
      </label>

      <ul>
        {filteredTodos.map((todo) => (
          <li key={todo.id}>
            {editIndex === todo.id ? (
              <form onSubmit={(e) => saveEdit(e)}>
                <input
                  value={editTask}
                  onChange={(e) => setEditTask(e.target.value)}
                  autoFocus
                />
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditIndex(null)}>
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />
                <span>{todo.title}</span>
                <button
                  type="button"
                  onClick={() => startEdit(todo)}
                >
                  Edit
                </button>
                <button type="button" onClick={() => deleteTodo(todo.id)}>
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;