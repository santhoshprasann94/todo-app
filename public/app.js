let todos = [];
let currentFilter = 'all';

async function fetchTodos() {
  const res = await fetch('/api/todos');
  todos = await res.json();
  renderTodos();
}

async function addTodo() {
  const input = document.getElementById('todoInput');
  const text = input.value.trim();
  if (!text) return;

  await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });

  input.value = '';
  fetchTodos();
}

async function toggleTodo(id) {
  await fetch('/api/todos/' + id, { method: 'PUT' });
  fetchTodos();
}

async function deleteTodo(id) {
  await fetch('/api/todos/' + id, { method: 'DELETE' });
  fetchTodos();
}

async function clearCompleted() {
  const completed = todos.filter(function(t) { return t.completed; });
  for (const todo of completed) {
    await fetch('/api/todos/' + todo.id, { method: 'DELETE' });
  }
  fetchTodos();
}

function renderTodos() {
  const list = document.getElementById('todoList');
  const filtered = todos.filter(function(t) {
    if (currentFilter === 'active') return !t.completed;
    if (currentFilter === 'completed') return t.completed;
    return true;
  });

  list.innerHTML = '';

  filtered.forEach(function(todo) {
    const li = document.createElement('li');
    if (todo.completed) li.classList.add('completed');

    li.innerHTML =
      '<input type="checkbox" ' + (todo.completed ? 'checked' : '') +
      ' onchange="toggleTodo(' + todo.id + ')" />' +
      '<span>' + todo.text + '</span>' +
      '<button class="delete-btn" onclick="deleteTodo(' + todo.id + ')">×</button>';

    list.appendChild(li);
  });

  const remaining = todos.filter(function(t) { return !t.completed; }).length;
  document.getElementById('itemCount').textContent =
    remaining + ' task' + (remaining !== 1 ? 's' : '') + ' remaining';
}

document.querySelectorAll('.filter-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.filter-btn').forEach(function(b) {
      b.classList.remove('active');
    });
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTodos();
  });
});

document.getElementById('todoInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') addTodo();
});

document.getElementById('addBtn').addEventListener('click', addTodo);
document.getElementById('clearBtn').addEventListener('click', clearCompleted);

fetchTodos();