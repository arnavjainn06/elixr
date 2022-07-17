const { ipcRenderer } = require("electron");

const tasks = document.getElementById("tasks");
const counter = document.getElementById("counter");

let taskLength;
let completedNo = 0;
let lastSave = [];

ipcRenderer.send("dimensions", [window.screen.width, window.screen.height]);

$.getJSON("tasks.json", function (json) {
    taskLength = json.tasks.length;
    lastSave = json.tasks;
    console.log(taskLength);
    tasks.innerHTML = null;
    completedNo = 0;

    if (taskLength > 0) {
        for (let x = 0; x < taskLength; x++) {
            if (json.tasks[x].completed) {
                tasks.innerHTML += `
                <div class="task checked" id="${json.tasks[x].id}">
                    <div class="content">
                        <img onclick="switchState(${json.tasks[x].id})" src="./assets/checker.svg" class="svg-fig"/>
                        <span>${json.tasks[x].taskTitle}</span>
                    </div>
                    <ion-icon onclick="deleteTask(${json.tasks[x].id})" name="trash" class="trash"></ion-icon>
                </div>
                `;
                completedNo++;
            } else {
                tasks.innerHTML += `
                <div class="task" id="${json.tasks[x].id}">
                    <div class="content">
                        <img onclick="switchState(${json.tasks[x].id})" src="./assets/ellipsis.svg" class="svg-fig"/>
                        <span>${json.tasks[x].taskTitle}</span>
                    </div>
                    <ion-icon onclick="deleteTask(${json.tasks[x].id})" name="trash" class="trash"></ion-icon>
                </div>
                `;
            }
        }
    } else if (taskLength == 0) {
        tasks.innerHTML += `
        <div class="notask">
            <img src="./assets/done.svg"/>
            <h2>All Caught Up!<h2/>
        <div/>
        `;
    }

    counter.innerHTML = `${completedNo} of ${taskLength} <ion-icon name="checkmark-outline" class="checkmark-outline"></ion-icon>`;
});

const newTaskTitle = document.getElementById("newTaskTitle");

newTaskTitle.addEventListener("keypress", (e) => {
    if (e.which == 13 || e.keyCode == 13) {
        if (e.target.value.trim() != "") {
            let newMap = {
                taskTitle: e.target.value,
                completed: false,
                id: Math.floor(100000 + Math.random() * 900000),
            };

            lastSave.push(newMap);

            ipcRenderer.send("rewrite", lastSave);
            newTaskTitle.value = "";
        }
    }

    // resetVC();
});

const addBtn = document.getElementById("add-btn");

addBtn.onclick = () => {
    if (newTaskTitle.value.trim() != "") {
        let newMap = {
            taskTitle: newTaskTitle.value,
            completed: false,
            id: Math.floor(100000 + Math.random() * 900000),
        };

        lastSave.push(newMap);

        ipcRenderer.send("rewrite", lastSave);
        newTaskTitle.value = "";
    }
};

function resetVC() {
    $.getJSON("tasks.json", function (json) {
        taskLength = json.tasks.length;
        lastSave = json.tasks;
        console.log(taskLength);
        tasks.innerHTML = null;
        completedNo = 0;

        if (taskLength > 0) {
            for (let x = 0; x < taskLength; x++) {
                if (json.tasks[x].completed) {
                    tasks.innerHTML += `
                    <div class="task checked" id="${json.tasks[x].id}">
                        <div class="content">
                            <img onclick="switchState(${json.tasks[x].id})" src="./assets/checker.svg" class="svg-fig"/>
                            <span>${json.tasks[x].taskTitle}</span>
                        </div>
                        <ion-icon onclick="deleteTask(${json.tasks[x].id})" name="trash" class="trash"></ion-icon>
                    </div>
                    `;
                    completedNo++;
                } else {
                    tasks.innerHTML += `
                    <div class="task" id="${json.tasks[x].id}">
                        <div class="content">
                            <img onclick="switchState(${json.tasks[x].id})" src="./assets/ellipsis.svg" class="svg-fig"/>
                            <span>${json.tasks[x].taskTitle}</span>
                        </div>
                        <ion-icon onclick="deleteTask(${json.tasks[x].id})" name="trash" class="trash"></ion-icon>
                    </div>
                    `;
                }
            }
        } else if (taskLength == 0) {
            tasks.innerHTML += `
            <div class="notask">
                <img src="./assets/done.svg"/>
                <h2>All Caught Up!<h2/>
            <div/>
            `;
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

function deleteTask(id) {
    lastSave.map((elx) => {
        if (elx.id === id) {
            const integral = lastSave.indexOf(elx);
            lastSave.splice(integral, 1);
        }
    });
    ipcRenderer.send("rewrite", lastSave);
}

function getRes() {
    return [window.screen.width, window.screen.height];
}
