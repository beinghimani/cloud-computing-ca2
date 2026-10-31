
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Announcement = mongoose.model("Announcement", announcementSchema);

app.get("/", (req, res) => {
    res.send("Cloud Computing CA2 Backend is Running!");
});

app.get("/api/health", (req, res) => {
    res.json({
        status: "success",
        message: "Backend is working",
        database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
    });
});

app.get("/api/announcements", async (req, res) => {
    try {
        const announcements = await Announcement.find().sort({ createdAt: -1 });
        res.json(announcements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post("/api/announcements", async (req, res) => {
    try {
        const { title, message } = req.body;

        if (!title || !message) {
            return res.status(400).json({
                message: "Title and message are required"
            });
        }

        const announcement = new Announcement({ title, message });
        await announcement.save();

        res.status(201).json({
            message: "Announcement published successfully",
            announcement
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully!");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB Connection Failed:", error.message);
        process.exit(1);
    });
