import { useState, useEffect } from "react";

const STORAGE_KEY = "todo-app-tasks";

const loadTasks = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

function App() {
  const [tasks, setTasks] = useState(loadTasks);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all"); // all | pending | completed
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      /* ignore storage errors */
    }
  }, [tasks]);

  const addTask = () => {
    const text = input.trim();
    if (!text) return;
    setTasks([...tasks, { id: Date.now(), text, completed: false }]);
    setInput("");
  };

  const toggleTask = (id) =>
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));

  const deleteTask = (id) => setTasks(tasks.filter((t) => t.id !== id));

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const saveEdit = (id) => {
    const text = editText.trim();
    if (text) {
      setTasks(tasks.map((t) => (t.id === id ? { ...t, text } : t)));
    }
    setEditingId(null);
    setEditText("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const visibleTasks = tasks.filter((t) => {
    if (filter === "pending") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;

  return (
    <div className="todo">
      <style>{css}</style>

      <h1>Todo App</h1>

      <div className="add-row">
        <input
          type="text"
          placeholder="Enter a task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      <div className="filters">
        {["all", "pending", "completed"].map((f) => (
          <button
            key={f}
            className={filter === f ? "active" : ""}
            onClick={() => setFilter(f)}
          >
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="list">
        {visibleTasks.length === 0 && <p className="empty">No tasks here.</p>}

        {visibleTasks.map((task) => (
          <div className="task" key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
            />

            {editingId === task.id ? (
              <>
                <input
                  className="edit-input"
                  type="text"
                  value={editText}
                  autoFocus
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit(task.id);
                    if (e.key === "Escape") cancelEdit();
                  }}
                />
                <button onClick={() => saveEdit(task.id)}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                <span className={task.completed ? "text done" : "text"}>{task.text}</span>
                <button onClick={() => startEdit(task)}>Edit</button>
                <button onClick={() => deleteTask(task.id)}>Delete</button>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="stats">
        <p>Total Tasks: {total}</p>
        <p>Completed: {completed}</p>
        <p>Pending: {pending}</p>
      </div>
    </div>
  );
}

const css = `
.todo {
  max-width: 560px;
  margin: 0 auto;
  padding: 2rem 1rem;
  text-align: center;
  color: #f2f2f2;
  font-family: system-ui, Arial, sans-serif;
}
.todo h1 { font-size: 2.6rem; margin-bottom: 1.5rem; }

.todo button {
  background: #8a8a8a;
  color: #fff;
  border: 1px solid transparent;
  border-radius: 4px;
  padding: 0.6rem 1rem;
  font-size: 1rem;
  cursor: pointer;
}
.todo button:hover { background: #9d9d9d; }
.todo button:focus-visible,
.todo input:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }

.todo .add-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.todo .add-row input {
  flex: 1;
  min-width: 0;
  padding: 0.8rem 1rem;
  font-size: 1rem;
  color: #fff;
  background: #7a7a7a;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.todo .add-row input::placeholder { color: #e6e6e6; }

.todo .filters {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.todo .filters button.active { background: #c9c9c9; color: #111; }

.todo .list { display: flex; flex-direction: column; gap: 0.75rem; }
.todo .task {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.9rem 1rem;
  border: 1px solid #e6e6e6;
  text-align: left;
}
.todo .task .text { flex: 1; font-size: 1.15rem; word-break: break-word; }
.todo .task .text.done { text-decoration: line-through; opacity: 0.55; }
.todo .task .edit-input {
  flex: 1;
  min-width: 0;
  padding: 0.5rem;
  font-size: 1rem;
  color: #fff;
  background: #7a7a7a;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.todo .empty { opacity: 0.6; }

.todo .stats { margin-top: 1.5rem; font-weight: 600; }
.todo .stats p { margin: 0.35rem 0; }
`;

export default App;