import express from "express";
import cors from "cors";

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get("/api", (req, res) => {
  res.json({ message: "hello from server" });
});

// Root route for testing
app.get("/", (req, res) => {
  res.send("Express server is running!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});