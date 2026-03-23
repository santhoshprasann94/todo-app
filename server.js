const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'todos.json');

app.use(express.json());
app.use(express.static('public'));

function readTodos() {
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(data);
}

function writeTodos(todos) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
}

// Get all todos
app.get('/api/todos', (req, res) => {
  const todos = readTodos();
  res.json(todos);
});

// Add a new todo
app.post('/api/todos', (req, res) => {
  const todos = readTodos();
  const newTodo = {
    id: Date.now(),
    text: req.body.text,
    completed: false
  };
  todos.push(newTodo);
  writeTodos(todos);
  res.json(newTodo);
});

// Toggle complete
app.put('/api/todos/:id', (req, res) => {
  const todos = readTodos();
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (todo) {
    todo.completed = !todo.completed;
    writeTodos(todos);
    res.json(todo);
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});

// Delete a todo
app.delete('/api/todos/:id', (req, res) => {
  let todos = readTodos();
  todos = todos.filter(t => t.id !== parseInt(req.params.id));
  writeTodos(todos);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
}); 