const { contextBridge } = require("electron");
const ejs = require("ejs");

contextBridge.exposeInMainWorld("ejs", ejs);
