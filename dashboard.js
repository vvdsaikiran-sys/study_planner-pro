const clearCompletedBtn = document.getElementById("clearCompletedBtn");

clearCompletedBtn.addEventListener("click", clearCompletedTasks);

const userEmail = localStorage.getItem("userEmail");

if (!userEmail) {

    alert("Please login first.");

    window.location.href = "login.html";

}const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", logout);const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
const stats = document.getElementById("stats");
const searchInput = document.getElementById("searchInput");

let allTasks = [];

loadTasks();

addButton.addEventListener("click", addTask);
searchInput.addEventListener("input", displayTasks);

async function addTask() {

    const task = document.getElementById("taskInput").value;
    const priority = document.getElementById("priority").value;
    const dueDate = document.getElementById("dueDate").value;

    if (task === "") {
        alert("Please enter a task");
        return;
    }

    const response = await fetch("http://localhost:5000/addTask", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userEmail,
            task,
            priority,
            dueDate
        })
    });

    const result = await response.json();

    alert(result.message);

    document.getElementById("taskInput").value = "";

    loadTasks();

}

async function loadTasks() {


    const response = await fetch("http://localhost:5000/getTasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userEmail
        })
    });

    allTasks = await response.json();

    const total = allTasks.length;
    const completed = allTasks.filter(task => task.completed).length;
    const pending = total - completed;

    stats.textContent =
        `Total: ${total} | Completed: ${completed} | Pending: ${pending}`;

    displayTasks();

}

function displayTasks() {

    const search = searchInput.value.toLowerCase();

    taskList.innerHTML = "";

    const filteredTasks = allTasks.filter(task =>
        task.task.toLowerCase().includes(search)
    );

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        const taskText = document.createElement("span");
        taskText.style.cursor = "pointer";
        taskText.innerHTML = `
        <strong>[${task.priority}]</strong> ${task.task}
        <br>
        <small>📅 Due: ${task.due_date ? task.due_date : "No Due Date"}</small>
        `;
        if (task.completed) {
            taskText.style.textDecoration = "line-through";
        }

        taskText.onclick = async function () {

            await fetch("http://localhost:5000/completeTask", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: task.id,
                    completed: !task.completed
                })
            });

            loadTasks();

        };

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";

        editButton.onclick = async function () {

            const newTask = prompt("Edit Task", task.task);

            if (!newTask) return;

            await fetch("http://localhost:5000/editTask", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: task.id,
                    task: newTask
                })
            });

            loadTasks();

        };

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.onclick = async function () {

            await fetch("http://localhost:5000/deleteTask", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: task.id
                })
            });

            loadTasks();

        };

        li.appendChild(taskText);
        li.appendChild(editButton);
        li.appendChild(deleteButton);

        taskList.appendChild(li);

    });

}
function logout() {

    localStorage.removeItem("userEmail");

    alert("Logged Out Successfully");

    window.location.href = "login.html";

}
async function clearCompletedTasks() {

    const userEmail = localStorage.getItem("userEmail");

    const response = await fetch("http://localhost:5000/clearCompleted", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            userEmail
        })

    });

    const result = await response.json();

    alert(result.message);

    loadTasks();

}
async function sendMessage() {

    const input = document.getElementById("chatInput");
    const messages = document.getElementById("chatMessages");

    const message = input.value.trim();

    if (!message) return;

    messages.innerHTML += `<p><strong>You:</strong> ${message}</p>`;
    messages.innerHTML += `<p id="typing"><strong>AI:</strong> Typing...</p>`;
    messages.scrollTop = messages.scrollHeight;

    input.value = "";

    const response = await fetch("http://localhost:5000/chat", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            message
        })

    });

    const data = await response.json();
    document.getElementById("typing").remove();

    messages.innerHTML += `<p><strong>AI:</strong> ${data.reply}</p>`;
    localStorage.setItem("chatHistory", messages.innerHTML);

    messages.scrollTop = messages.scrollHeight;

}
const chatInput = document.getElementById("chatInput");

chatInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
});
window.addEventListener("load", function () {

    const messages = document.getElementById("chatMessages");

    const history = localStorage.getItem("chatHistory");

    if (history) {
        messages.innerHTML = history;
        messages.scrollTop = messages.scrollHeight;
    }

});
function closeChat() {
    document.getElementById("chatContainer").style.display = "none";
}
function openChat() {
    document.getElementById("chatContainer").style.display = "block";
}