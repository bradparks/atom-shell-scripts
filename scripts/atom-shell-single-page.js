/*!
**  atom-shell-scripts -- Sample scripts to run atom-shell based applications.
**  Copyright (c) 2014 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/atom-shell-scripts>
*/
// - -------------------------------------------------------------------- - //

var fs = require("fs");
var cwd = __dirname;
var mainWindow = null;

// - -------------------------------------------------------------------- - //

function runApp() {
	var app = require("app");
	app.on("will-quit",function() {
		if (fs.existsSync(cwd + "/pid")) fs.unlinkSync(cwd + "/pid");
	});
	app.on("window-all-closed",function() {
		if (process.platform != "darwin") app.quit();
	});
	app.on("ready", function() {
		fs.writeFile(cwd + "/pid",process.pid,function(error) {
			if (error) {
				showMessage(error);
			}
		});
	});
	app.on("will-finish-launching",function() {
		openWindow();
	});
}

function isRunning() {
	var running = false;
	if (fs.existsSync(cwd + "/pid")) {
		var pid = fs.readFileSync(cwd + "/pid","utf8");
		try { running = process.kill(pid,0); }
		catch(e) {}
	}
	return running;
}

function showMessage(message) {
	if (typeof message == "error") {
		message = message.toString();
	}
	var app = require("app");
	var dialog = require("dialog");
	dialog.showMessageBox({
		type: "warning",
		buttons: ["OK"],
		title: app.getName(),
		message: message.replace(/{productName}/g,app.getName()),
	});
}

function openWindow() {
	var BrowserWindow = require("browser-window");
	mainWindow = new BrowserWindow({
		"width": 1000,
		"height": 800,
		"min-width": 800,
		"min-height": 600
	});
	mainWindow.on("closed", function() {
		mainWindow = null;
	});
	mainWindow.loadUrl(cwd + "/index.html");
	mainWindow.openDevTools();
}

// - -------------------------------------------------------------------- - //

if (isRunning()) {
	showMessage("{productName} is already running.");
	process.exit();
} else {
	runApp();
}

// - -------------------------------------------------------------------- - //
