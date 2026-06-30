const mongoose = require('mongoose');

const todoChecklistSchema = new mongoose.Schema(
    {
        text: String,
        completed: {
            type: Boolean,
            default: false
        }
    }
);

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Task title is required"],
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true
        },
        assignedTo: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium"
        },
        status: {
            type: String,
            enum: ["pending", "in-progress", "completed"],
            default: "pending"
        },
        dueDate: {
            type: Date
        },
        todoCheckList: [todoChecklistSchema],
        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
    },
    {timestamps: true}
);

module.exports = mongoose.model("Task", taskSchema)