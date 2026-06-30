const express = require('express');
const router = express.Router();
const Project = require("../models/Project");
const { protect , adminOnly } = require("../middleware/authMiddleware");

router.post("/" , protect , adminOnly , async (req, res) => {
    try {
        const { name , description , members } = req.body

        const project = await Project.create({
            name, 
            description,
            owner: req.user._id,
            members: members || []
        })

        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message})
    }
});

router.get("/" , protect , async (req, res) => {
    try{
        let projects;

        if(req.user.role === "admin"){
            projects = await Project.find().populate("members", "name email")
        }
        else{
            projects = await Project.find({
                members: req.user._id,
            }).populate("members", "name email")
        }

        res.json(projects);
    }
    catch(error){
        res.status(500).json({message: "Server error", error: error.message})
    }
});

router.put("/:id" , protect , adminOnly , async (req , res) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        )
        if(!project){
            return res.status(404).json({message: "Project not found"})
        }

        res.json(project)
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message})
    }
});

router.delete("/:id" , protect , adminOnly , async ( req , res ) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);

        if(!project){
            return res.status(404).json({message: "Project not found"})
        }

        res.json({message: "Project deleted successfully"})
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message})
    }
});

module.exports = router;