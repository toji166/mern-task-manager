const express = require('express');
const Task = require('../models/Task');
const router = express.Router();
const { protect , adminOnly } = require("../middleware/authMiddleware")

router.post("/" , protect , adminOnly , async (req, res) => {
    try {
        const {
            title,
            description,
            project,
            assignedTo,
            priority,
            dueDate,
            todoChecklist
        } = req.body

        const task = await Task.create({
            title,
            description,
            project,
            assignedTo,
            createdBy: req.user._id,
            priority,
            dueDate,
            todoChecklist
        });

        res.status(201).json(task)
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message})
    }
});

router.get("/" , protect , async (req,res) => {
    try {
        let tasks;

        if(req.user.role === "admin") {
            tasks = await Task.find().populate("assignedTo" , "name email").populate("project" , "name")
        }
        else{
            tasks = await Task.find({assignedTo: req.user._id}).populate("assignedTo" , "name email").populate("project" , "name")
        }

        res.json(tasks);

    } catch (error) {
        res.status(500).json({message: "Server error" , error: error.message})
    }
});

router.get("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("project", "name")
      .populate("createdBy", "name");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/:id/status", protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    
    const isAssigned = task.assignedTo.some(
      (userId) => userId.toString() === req.user._id.toString()
    );

    if (!isAssigned && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    task.status = req.body.status;

    if (req.body.status === "completed") task.progress = 100;
    else if (req.body.status === "in-progress") task.progress = 50;
    else task.progress = 0;

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/:id/checklist", protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.todoChecklist = req.body.todoChecklist;

    const completed = task.todoChecklist.filter((t) => t.completed).length;
    const total = task.todoChecklist.length;
    task.progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;