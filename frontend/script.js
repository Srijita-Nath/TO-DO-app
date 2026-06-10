async function loadTasks() {
    const response = await fetch("http://localhost:3000/tasks");
    const tasks = await response.json();

    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement("li");

        li.textContent = task.text;

        if (task.completed) {
            li.style.textDecoration = "line-through";
        }

        // Toggle complete/incomplete
        li.addEventListener("click", async () => {
            await fetch(`http://localhost:3000/tasks/${task.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    completed: !task.completed
                })
            });

            loadTasks();
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = " Delete ";

        deleteBtn.addEventListener("click", async (e) => {
            e.stopPropagation();

            await fetch(`http://localhost:3000/tasks/${task.id}`, {
                method: "DELETE"
            });

            loadTasks();
        });

        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

async function addTask() {
    const input = document.getElementById("taskInput");

    if (input.value.trim() === "") {
        alert("Please enter a task");
        return;
    }

    await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            text: input.value
        })
    });

    input.value = "";

    loadTasks();
}

// Load tasks when page opens
loadTasks();