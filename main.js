const {
    app,
    BrowserWindow,
    globalShortcut,
    Tray,
    systemPreferences,
    shell,
    Menu,
    ipcMain,
} = require("electron");
const path = require("path");

const ciqlJSON = require("ciql-json");

let tray;
let window;

let x;
let y;

const assetsDirectory = path.join(__dirname, "assets");

ipcMain.on("dimensions", (event, data) => {
    x = data[0];
    y = data[1];
});

app.on("ready", () => {
    initializeApp();
    initializeTray();
});

const initializeTray = () => {
    if (process.platform == "win32") {
        tray = new Tray(path.join(assetsDirectory, "tray_icon_win.png"));
    } else {
        tray = new Tray(path.join(assetsDirectory, "iconTemplate@2x.png"));
    }

    // tray.on("double-click", toggleWindow);
    tray.on("click", function (event) {
        toggleWindow();
    });
};

const initializeApp = () => {
    window = new BrowserWindow({
        height: 400,
        width: 305,
        transparent: true,
        center: true,
        fullscreenable: false,
        movable: false,
        vibrancy: "dark",
        minimizable: false,
        frame: false,
        x: 1195,
        y: 45,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // trigger require isolation
            backgroundThrottling: false,
            devTools: true,
        },
    });

    window.setAlwaysOnTop(true, "screen-saver"); // - 2 -
    window.setVisibleOnAllWorkspaces(true);
    // window.webContents.toggleDevTools();

    window.on("blur", () => {
        destroyWindow();
    });

    window.webContents.on("new-window", function (e, url) {
        e.preventDefault();
        require("electron").shell.openExternal(url);
    });

    if (process.platform == "darwin") {
        // Don't show the app in the dock for macOS
        app.dock.hide();
    } else {
        // To hide the app in the dock for windows and linux
        window.setSkipTaskbar(true);
    }

    window.loadURL(`file://${path.join(__dirname, "index.html")}`);
};

function toggleWindow() {
    if (window.isVisible()) {
        destroyWindow();
    } else {
        launchWindow();
    }
}

function destroyWindow() {
    if (process.platform == "darwin") {
        app.hide();
        window.hide();
    } else {
        window.minimize();
        window.hide();
    }
}

function launchWindow() {
    window.setVisibleOnAllWorkspaces(true, {
        visibleOnFullScreen: true,
    });
    window.setSize(305, 400);
    // setTimeout(() => {
    // window.show();
    // }, 280);
    window.show();
}

ipcMain.on("rewrite", (event, data) => {
    ciqlJSON.open("tasks.json").set("tasks", data).save();
    window.webContents.send("success");
});

ipcMain.on("switchStateSystem", (event, data) => {
    // console.log(data);
});
