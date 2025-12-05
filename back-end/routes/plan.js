const express = require("express");
const router = express.Router();
const Plan = require("../models/Plan");
const { protect } = require("../middleware/authMiddleware");

router.get("/getAllPlans", protect, async (req, res) => {
    try {
        const plans = await Plan.find({ userId: req.userId }).sort({ date: -1 });
        res.status(200).json(plans);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve plans" });
    }
});

router.post("/save", protect, async (req, res) => {
    const { planDetails } = req.body;

    if (!planDetails || planDetails.length === 0) {
        return res.status(400).json({ error: "No plan details provided!" });
    }

    try {
        const plansWithUser = planDetails.map(plan => ({
            ...plan,
            userId: req.userId
        }));

        const newPlans = await Plan.insertMany(plansWithUser);
        res.status(201).json({ message: "Plan saved successfully!", data: newPlans });
    } catch (error) {
        res.status(500).json({ error: "Failed to save the plan" });
    }
});

router.put("/updatePlan/:id", protect, async (req, res) => {
    const { id } = req.params;
    const { task, date, expectedExpenses, actualExpenses } = req.body;

    try {
        const plan = await Plan.findById(id);
        if (!plan) return res.status(404).json({ error: "Plan not found" });
        
        if (plan.userId.toString() !== req.userId) {
            return res.status(403).json({ error: "Not authorized" });
        }

        const updatedPlan = await Plan.findByIdAndUpdate(
            id, 
            { task, date, expectedExpenses, actualExpenses },
            { new: true }
        );
        
        res.json({ message: "Plan updated successfully", plan: updatedPlan });
    } catch (error) {
        res.status(500).json({ error: "Failed to update plan" });
    }
});

router.delete("/deletePlan/:id", protect, async (req, res) => {
    const { id } = req.params;

    try {
        const plan = await Plan.findById(id);
        if (!plan) return res.status(404).json({ error: "Plan not found" });
        
        if (plan.userId.toString() !== req.userId) {
            return res.status(403).json({ error: "Not authorized" });
        }

        await Plan.findByIdAndDelete(id);
        res.json({ message: "Plan deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete plan" });
    }
});

router.put("/toggleDone/:id", protect, async (req, res) => {
    try {
        const plan = await Plan.findById(req.params.id);
        if (!plan) return res.status(404).json({ error: "Plan not found" });

        if (plan.userId.toString() !== req.userId) {
            return res.status(403).json({ error: "Not authorized" });
        }

        plan.done = !plan.done;
        await plan.save();
        
        res.json({ 
            message: "Status updated successfully",
            done: plan.done
        });
    } catch (error) {
        console.error("Error toggling done status:", error);
        res.status(500).json({ error: "Failed to update status" });
    }
});

module.exports = router;