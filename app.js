import "dotenv/config";
import express from "express";
import helmet from "helmet";
import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  createUser,
} from "./database.js";

// Port variable and regex for email validation
const port = process.env.PORT || 3000;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const app = express();

// Secure using HTTP headers
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/users", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    // Catch connection errors
    console.error("Database error:", error.stack);
    res.status(500).json({ error: "Database error occurred" });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const user = await getUser(req.params.id);
    // Check if user exists
    if (!user) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.json(user);
    }
  } catch (error) {
    // Catch connection errors
    console.error("Database error:", error.stack);
    res.status(500).json({ error: "Database error occurred" });
  }
});

app.post("/users", async (req, res) => {
  const { username, email, age } = req.body;
  // Check if required fields are missing and if input data is valid
  if (!username || !email || !age) {
    return res
      .status(400)
      .json({ error: "Username, email, and age are required fields" });
  }
  if (username.length > 20 || username.length < 3) {
    return res
      .status(400)
      .json({ error: "Username too long or too short (3-20 char limit)" });
  }
  if (age > 130) {
    return res.status(400).json({ error: "Age value too high (max. 130)" });
  }
  // Check if email is a valid email address
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }
  try {
    // Proceed with user creation if validation passes
    const user = await createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    // Catch connection errors or errors arising from credentials already being taken
    console.error("Database error:", error.stack);
    res.status(500).json({ error: "Database error occurred" });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    // Check if the user exists
    const existingUser = await getUser(req.params.id);
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }
    // User exists, proceed with the deletion
    const user = await deleteUser(req.params.id, req.body);
    res.json(user);
  } catch (error) {
    console.error("Database error:", error.stack);
    res.status(500).json({ error: "Database error occurred" });
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    // Check if the user exists
    const existingUser = await getUser(req.params.id);
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }
    // User exists so validate input data
    const { username, email, age } = req.body;
    if (username) {
      if (username.length > 20 || username.length < 3) {
        return res
          .status(400)
          .json({ error: "Username too long or too short (3-20 char limit)" });
      }
    }
    if (age) {
      if (age > 130) {
        return res.status(400).json({ error: "Age value too high (max. 130)" });
      }
    }
    if (email) {
      // Check if email is a valid email address
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email address" });
      }
    }
    if (!username && !age && !email) {
      return res
        .status(400)
        .json({
          error:
            "No input provided: provide either username, email, age or all of these",
        });
    }
    // User exists and data is valid, proceed with the update
    const user = await updateUser(req.params.id, req.body);
    res.json(user);
  } catch (error) {
    // Provide bare minimum error info to client, dump useful error info to server console
    console.error("Database error:", error.stack);
    res.status(500).json({ error: "Database error occurred" });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message });
});

app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`);
});

export default app;
