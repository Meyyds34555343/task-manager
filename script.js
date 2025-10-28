
const API_URL = "http://localhost:5000/api/tasks";

window.addEventListener("DOMContentLoaded", loadTasks);

async function loadTasks() {
  const res = await fetch(API_URL);
  const tasks = await res.json();

  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";

    const disabled = task.completed ? "disabled" : "";

    li.innerHTML = `
      <span>${task.title}</span>
      <div>
        <button class="complete-btn" onclick="toggleComplete(${task.id}, ${!task.completed})">
          ${task.completed ? "↩" : "✔"}
        </button>
        <button class="edit-btn" ${disabled} onclick="editTask(${task.id}, '${task.title}')">✎</button>
        <button class="delete-btn" onclick="deleteTask(${task.id})">🗑</button>
      </div>
    `;
    list.appendChild(li);
  });
}
document.getElementById("addBtn").addEventListener("click", async () => {
  const title = document.getElementById("taskTitle").value.trim();
  if (!title) return alert("Enter a task title");

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title })
  });

  document.getElementById("taskTitle").value = "";
  loadTasks();
});
async function deleteTask(id) {
  if (!confirm("Delete this task?")) return;
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  loadTasks();
}

async function editTask(id, title) {
  const new_title = prompt("Edit task:", title);
  if (new_title === null || new_title.trim() === "") return;
  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: new_title })
  });
  loadTasks();
}
async function toggleComplete(id, completed) {
  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed })
  });
  loadTasks();
}
