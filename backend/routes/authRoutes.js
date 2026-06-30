const express = require("express");
const jwt = require('jsonwebtoken')
const User = require("../models/User");
const { protect , adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "30d"})
};

router.post("/register", async(req, res) => {
    try{
        const {name, email, password, role} = req.body
        console.log("Register attempt:", { name, email, role });

        const userExists = await User.findOne({email})
        if(userExists){
            return res.status(400).json({message: "User already exists"})
        }

        const user = await User.create({name, email, password, role})

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        })
    }
    catch(error){
            console.error("Register error:", error);
        res.status(500).json({message: "Server error", error: error.message})
    }
});

router.post("/login", async (req, res) => {
    try{
        const {email, password} = req.body

        const user = await User.findOne({email})

        if(user && (await user.matchPassword(password))){
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            })
            }
            else{
                res.status(401).json({message: "Invalid email or password"})
        }
    }
    catch(error){
        res.status(500).json({message: "Server error", error: error.message})
    }
});

router.get("/profile", protect, async (req, res) => {
    try{
        const user = await User.findById(req.user._id);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        })
    }
    catch(error){
        res.status(500).json({message: "Server error", error: error.message})
    }
});


router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


module.exports = router