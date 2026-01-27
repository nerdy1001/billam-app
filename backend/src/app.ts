import express, { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Health check
app.get("/", (req: Request, res: Response) => {
  res.json({
    status: "success",
    message: "Server is running 🚀",
  });
});

// Example route
app.get("/api/hello", (req: Request, res: Response) => {
  res.json({ message: "Hello from Express!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
