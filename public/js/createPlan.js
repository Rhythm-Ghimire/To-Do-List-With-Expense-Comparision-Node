document.addEventListener("DOMContentLoaded", function() {
    const table = document.querySelector("#planDetailsTable tbody");
    const addRowBtn = document.getElementById("addRow");
    const form = document.getElementById("createPlanForm");

    function addRow(rowNumber) {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${rowNumber}</td>
            <td><input type="text" name="task[]" placeholder="Task" required></td>
            <td><input type="date" name="date[]" required></td>
            <td><input type="number" name="expectedExpense[]" placeholder="Expected Amount" min="0" step="0.01" required></td>
            <td><input type="number" name="actualExpense[]" placeholder="Actual Amount" min="0" step="0.01" required></td>
        `;
        

        const dateInput = newRow.querySelector('input[type="date"]');
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
        
        table.appendChild(newRow);
        return newRow;
    }

    addRow(1);

    addRowBtn.addEventListener("click", function(e) {
        e.preventDefault();
        const rowCount = table.rows.length;
        addRow(rowCount + 1);
    });

    form.addEventListener("submit", async function(e) {
        e.preventDefault();
        
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login first');
            window.location.href = '/login';
            return;
        }

        const formData = new FormData(form);
        const planDetails = [];
        let hasErrors = false;

        const tasks = formData.getAll("task[]");
        const dates = formData.getAll("date[]");
        const expectedExpenses = formData.getAll("expectedExpense[]");
        const actualExpenses = formData.getAll("actualExpense[]");

        
        for (let i = 0; i < tasks.length; i++) {
            if (!tasks[i].trim() || !dates[i] || !expectedExpenses[i] || !actualExpenses[i]) {
                hasErrors = true;
                continue;
            }
            
            planDetails.push({
                task: tasks[i].trim(),
                date: dates[i],
                expectedExpenses: parseFloat(expectedExpenses[i]),
                actualExpenses: parseFloat(actualExpenses[i])
            });
        }

        if (hasErrors) {
            alert('Please fill all fields in each row');
            return;
        }

        if (planDetails.length === 0) {
            alert('Please add at least one plan');
            return;
        }

        try {
            
            const saveBtn = document.getElementById("savePlan");
            saveBtn.disabled = true;
            saveBtn.textContent = "Saving...";

            const response = await fetch("/api/plan/save", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ planDetails })
            });

            const result = await response.json();
            
            if (response.ok) {
                alert("Plan saved successfully!");
                window.location.href = "/index";
            } else {
                throw new Error(result.error || "Failed to save plan");
            }
        } catch (error) {
            console.error("Error:", error);
            alert(error.message || "Error saving plan");
        } finally {
            
            const saveBtn = document.getElementById("savePlan");
            saveBtn.disabled = false;
            saveBtn.textContent = "Save Plan";
        }
    });
});