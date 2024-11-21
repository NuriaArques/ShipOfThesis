import CORS from flask_cors


const express = require("express");
const { spawn } = require("child_process");

const app = express();
CORS(app)
let backendProcess = null;

// Start the Python backend
app.get("/start-backend", (req, res) => {
    if (backendProcess) {
        return res.status(400).send("Backend is already running.");
    }

    backendProcess = spawn("python", ["LLM-chatbot.py"]);

    backendProcess.stdout.on("data", (data) => {
        console.log(`Backend stdout: ${data}`);
    });

    backendProcess.stderr.on("data", (data) => {
        console.error(`Backend stderr: ${data}`);
    });

    backendProcess.on("close", (code) => {
        console.log(`Backend process exited with code ${code}`);
        backendProcess = null;
    });

    res.send("Backend started successfully.");
});

// Stop the Python backend
app.get("/stop-backend", (req, res) => {
    if (!backendProcess) {
        return res.status(400).send("Backend is not running.");
    }

    backendProcess.kill();
    backendProcess = null;
    res.send("Backend stopped successfully.");
});

app.listen(4000, () => {
    console.log("Controller server running on http://localhost:4000");
});

