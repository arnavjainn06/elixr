const { ipcRenderer } = require("electron");

const tasks = document.getElementById("tasks");
const counter = document.getElementById("counter");

let taskLength;
let completedNo = 0;
let lastSave = [];

$.getJSON("tasks.json", function (json) {
    taskLength = json.tasks.length;
    lastSave = json.tasks;
    console.log(taskLength);
    tasks.innerHTML = null;
    completedNo = 0;

    for (let x = 0; x < taskLength; x++) {
        if (json.tasks[x].completed) {
            tasks.innerHTML += `
            <div class="task checked" id="${json.tasks[x].id}">
                <img onclick="switchState(${json.tasks[x].id})" src="./assets/checker.svg" class="svg-fig"/>
                <span>${json.tasks[x].taskTitle}</span>
            </div>
            `;
            completedNo++;
        } else {
            tasks.innerHTML += `
            <div class="task" id="${json.tasks[x].id}">
                <img onclick="switchState(${json.tasks[x].id})" src="./assets/ellipsis.svg" class="svg-fig"/>
                <span>${json.tasks[x].taskTitle}</span>
            </div>
            `;
        }
    }

    counter.innerHTML = `${completedNo} of ${taskLength} <ion-icon name="checkmark-outline" class="checkmark-outline"></ion-icon>`;
});

const newTaskTitle = document.getElementById("newTaskTitle");

newTaskTitle.addEventListener("keypress", (e) => {
    if (e.which == 13 || e.keyCode == 13) {
        let newMap = {
            taskTitle: e.target.value,
            completed: false,
            id: Math.floor(100000 + Math.random() * 900000),
        };

        lastSave.push(newMap);

        ipcRenderer.send("rewrite", lastSave);
        newTaskTitle.value = "";
    }

    // resetVC();
});

function resetVC() {
    $.getJSON("tasks.json", function (json) {
        taskLength = json.tasks.length;
        lastSave = json.tasks;
        console.log(taskLength);
        tasks.innerHTML = null;
        completedNo = 0;

        for (let x = 0; x < taskLength; x++) {
            if (json.tasks[x].completed) {
                tasks.innerHTML += `
                <div class="task checked" id="${json.tasks[x].id}">
                    <img onclick="switchState(${json.tasks[x].id})" src="./assets/checker.svg" class="svg-fig"/>
                    <span>${json.tasks[x].taskTitle}</span>
                </div>
                `;
                completedNo++;
            } else {
                tasks.innerHTML += `
                <div class="task" id="${json.tasks[x].id}">
                    <img onclick="switchState(${json.tasks[x].id})" src="./assets/ellipsis.svg" class="svg-fig"/>
                    <span>${json.tasks[x].taskTitle}</span>
                </div>
                `;
            }
        }

        counter.innerHTML = `${completedNo} of ${taskLength} <ion-icon name="checkmark-outline" class="checkmark-outline"></ion-icon>`;
    });
}

ipcRenderer.on("success", () => {
    resetVC();
});

function switchState(id) {
    ipcRenderer.send("switchStateSystem", lastSave);
    lastSave.map((elx) => {
        if (elx.id === id) {
            elx.completed = !elx.completed;
        }
    });
    ipcRenderer.send("rewrite", lastSave);
}
