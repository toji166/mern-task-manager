const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require("./routes/authRoutes.js")
const projectRoutes = require("./routes/projectRoutes.js")
const taskRoutes = require("./routes/taskRoutes.js")


dotenv.config();

connectDB()

const app = express();

app.use(cors());
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/projects", projectRoutes)
app.use("/api/tasks", taskRoutes)

app.get("/", (req, res) => {
    res.json({message: "🚀 Mern Task Manager Api is running"})
})

const port = process.env.PORT
app.listen(port, () => {
    console.log(`✅ Server is Running on PORT ${port}`)
})

