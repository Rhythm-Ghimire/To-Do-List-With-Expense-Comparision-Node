const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
    task: { type: String, required: true },
    date: { type: Date, default: Date.now },
    expectedExpenses: { type: Number, required: true },
    actualExpenses: { type: Number, required: true },
    done: { type: Boolean, default: false },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('Plan', PlanSchema);