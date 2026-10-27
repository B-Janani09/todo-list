
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");
const emptyMessage = document.getElementById("empty-message");
const progressBar = document.getElementById("progress-bar");

// Load saved tasks when the page opens.
let tasks = [];

try {
  const savedTasks = localStorage.getItem("my-todo-tasks");
  const parsedTasks = savedTasks ? JSON.parse(savedTasks) : [];

  if (Array.isArray(parsedTasks)) {
    tasks = parsedTasks.filter(
      task =>
        task &&
        typeof task.id === "string" &&
        typeof task.text === "string" &&
        typeof task.completed === "boolean"
    );
  }
} catch (error) {
  tasks = [];
}

// Save the current task array in localStorage.
function saveTasks() {
  localStorage.setItem("my-todo-tasks", JSON.stringify(tasks));
}

// Build the visible list from the tasks array.
function renderTasks() {
  taskList.replaceChildren();

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.className = "task-item";

    if (task.completed) {
      li.classList.add("completed");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-check";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", "Mark task complete");

    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const taskText = document.createElement("span");
    taskText.className = "task-text";
    taskText.textContent = task.text;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", "Delete " + task.text);

    deleteButton.addEventListener("click", () => {
      tasks = tasks.filter(item => item.id !== task.id);
      saveTasks();
      renderTasks();
    });

    li.append(checkbox, taskText, deleteButton);
    taskList.appendChild(li);
  });

  const completedCount = tasks.filter(task => task.completed).length;
  const remainingCount = tasks.length - completedCount;

  taskCount.textContent =
    `${remainingCount} ${remainingCount === 1 ? "task" : "tasks"} left`;

  const progress = tasks.length === 0
    ? 0
    : (completedCount / tasks.length) * 100;

  progressBar.style.width = `${progress}%`;
  emptyMessage.hidden = tasks.length !== 0;
}

// Add a new task.
taskForm.addEventListener("submit", event => {
  event.preventDefault();

  const text = taskInput.value.trim();

  if (text === "") {
    taskInput.focus();
    return;
  }

  tasks.push({
    id: crypto.randomUUID(),
    text: text,
    completed: false
  });

  saveTasks();
  renderTasks();

  taskForm.reset();
  taskInput.focus();
});

// Display saved tasks on the first page load.
renderTasks();
