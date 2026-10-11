const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");

loadTasks();

addButton.addEventListener("click", function () {

    const task = taskInput.value.trim();

    if (task === "") {
        alert("Please enter a task.");
        return;
    }

    const taskObject = {
        text: task,
        completed: false
    };

    createTask(taskObject);

    saveTask(taskObject);

    taskInput.value = "";

});

taskInput.addEventListener("keypress", function (event) {

    if (event.key === "Enter") {
        addButton.click();
    }

});

function createTask(taskObject) {

    const li = document.createElement("li");

    const taskText = document.createElement("span");
    taskText.textContent = taskObject.text;

    if (taskObject.completed) {
        taskText.style.textDecoration = "line-through";
    }

    taskText.onclick = function () {

        taskObject.completed = !taskObject.completed;

        if (taskObject.completed) {
            taskText.style.textDecoration = "line-through";
        } else {
            taskText.style.textDecoration = "none";
        }

        updateTasks();

    };

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

    deleteButton.onclick = function () {

        li.remove();
        updateTaskCount();

        deleteTask(taskObject.text);

    };

    li.appendChild(taskText);
    li.appendChild(deleteButton);

    taskList.appendChild(li);
    updateTaskCount();
}

function saveTask(taskObject) {

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.push(taskObject);

    localStorage.setItem("tasks", JSON.stringify(tasks));

}

function loadTasks() {

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.forEach(function (taskObject) {

        createTask(taskObject);

    });

}

function deleteTask(taskText) {

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks = tasks.filter(function (task) {
        return task.text !== taskText;
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));

}

function updateTasks() {

    let tasks = [];

    document.querySelectorAll("#taskList li").forEach(function (li) {

        const text = li.querySelector("span").textContent;

        const completed =
            li.querySelector("span").style.textDecoration === "line-through";

        tasks.push({
            text: text,
            completed: completed
        });

    });

    localStorage.setItem("tasks", JSON.stringify(tasks));

}
function updateTaskCount() {

    const count = document.querySelectorAll("#taskList li").length;

    document.getElementById("taskCount").textContent =
        "Total Tasks: " + count;

}