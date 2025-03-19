import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 59535;

// Get __dirname in ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from "dist"
app.use(express.static(path.join(__dirname, "dist")));

// Ensure correct MIME type for JS files
app.use("/assets", express.static(path.join(__dirname, "dist/assets"), {
    setHeaders: (res, path) => {
        if (path.endsWith(".js")) {
            res.setHeader("Content-Type", "application/javascript");
        }
    }
}));

// Handle SPA (React/Vue)
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Start server
app.listen(PORT, () => {
    console.log(`🔥 Server running at http://localhost:${PORT}`);
});
