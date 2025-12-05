const express = require("express");
const router = express.Router();
const Profile = require("../models/Profile");
const { protect } = require("../middleware/authMiddleware");

router.post("/saveProfile", protect, async (req, res) => {
    const { username, address, phone } = req.body;

    try {
        
        let profile = await Profile.findOne({ userId: req.userId });

        if (profile) {
            
            profile.username = username;
            profile.address = address;
            profile.phone = phone;
        } else {
            
            profile = new Profile({
                username,
                address,
                phone,
                userId: req.userId
            });
        }

        await profile.save();
        res.status(200).json({ msg: "Profile saved successfully" });
    } catch (error) {
        console.error("Error saving profile:", error);
        res.status(500).json({ msg: "Server error" });
    }
});

router.get("/getProfile", protect, async (req, res) => {
    try {
        const profile = await Profile.findOne({ userId: req.userId });

        if (!profile) {
            return res.json({
                username: "",
                address: "",
                phone: ""
            });
        }

        res.json(profile);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ error: "Failed to fetch profile" });
    }
});

module.exports = router;