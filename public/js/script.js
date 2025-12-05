document.addEventListener("DOMContentLoaded", async function () {
    
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login';
        return;
    }

    await loadProfileData();
    
    await fetchAndDisplayExpenses();
    
    document.getElementById("toggleSidebar").addEventListener("click", function () {
        document.getElementById("sidebar").classList.toggle("visible");
    });

    
    document.getElementById("viewGraphBtn")?.addEventListener("click", function() {
        window.location.href = '/graphs';
    });

    document.getElementById("editProfile")?.addEventListener("click", function() {
        const inputs = document.querySelectorAll(".profile-info input");
        inputs.forEach(input => input.disabled = false);
        this.style.display = "none";
        document.getElementById("saveProfile").style.display = "inline-block";
    });

    document.getElementById("logoutBtn")?.addEventListener("click", function() {
        if (confirm("Are you sure you want to logout?")) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
    });
});

async function loadProfileData() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch("/api/profile/getProfile", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error("Failed to fetch profile data");
        
        const profile = await response.json();
        if (profile) {
            document.getElementById("username").value = profile.username || "";
            document.getElementById("address").value = profile.address || "";
            document.getElementById("phone").value = profile.phone || "";
        }
    } catch (error) {
        console.error("Error loading profile data:", error);
    }
}

async function fetchAndDisplayExpenses() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch("/api/plan/getAllPlans", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error("Failed to fetch data");

        const plans = await response.json();
        const tableBody = document.querySelector("#expenses-body");  
        tableBody.innerHTML = "";  

        if (plans.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6">No plans available. Create one!</td></tr>`;
            return;
        }

        
        plans.sort((a, b) => new Date(b.date) - new Date(a.date));

        plans.forEach((plan) => {
            const planDate = new Date(plan.date);
            
            const formattedDate = `${planDate.getMonth() + 1}/${planDate.getDate()}/${planDate.getFullYear()}`;
            
            const row = document.createElement("tr");
            if (plan.done) row.classList.add('completed-plan');
            
            row.innerHTML = `
                <td>${plan.task || "N/A"}</td>
                <td>${formattedDate}</td>
                <td>Rs.${plan.expectedExpenses || "0"}</td>
                <td>Rs.${plan.actualExpenses || "0"}</td>
                <td>
                    <button class="edit-btn" data-id="${plan._id}">Edit</button>
                    <button class="delete-btn" data-id="${plan._id}">Delete</button>
                </td>
                <td>
                    <button class="done-btn ${plan.done ? 'done-active' : ''}" 
                            data-id="${plan._id}" 
                            data-done="${plan.done || false}">
                        ${plan.done ? '✓ Done' : 'Mark Done'}
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        setupEditButtons();
        setupDeleteButtons();
        setupDoneButtons();
        
    } catch (error) {
        console.error("Error fetching plans:", error);
        document.querySelector("#expenses-body").innerHTML = 
            `<tr><td colspan="6">Error loading plans. Please try again.</td></tr>`;
    }
}

function setupEditButtons() {
    document.querySelectorAll(".edit-btn").forEach(button => {
        button.addEventListener("click", handleEditPlan);
    });
}

function setupDeleteButtons() {
    document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", handleDeletePlan);
    });
}

function setupDoneButtons() {
    document.querySelectorAll(".done-btn").forEach(button => {
        button.addEventListener("click", handleDoneToggle);
    });
}

async function handleEditPlan(e) {
    const planId = e.target.getAttribute("data-id");
    const row = e.target.closest("tr");
    const cells = row.querySelectorAll("td");
    
    
    const originalTask = cells[0].textContent;
    const dateText = cells[1].textContent;
    
   
    const [month, day, year] = dateText.split('/');
    const originalDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    
    const originalExpected = cells[2].textContent.replace('Rs.', '').trim();
    const originalActual = cells[3].textContent.replace('Rs.', '').trim();
    
    
    cells[0].innerHTML = `<input type="text" value="${originalTask}">`;
    cells[1].innerHTML = `<input type="date" value="${originalDate}">`;
    cells[2].innerHTML = `<input type="number" value="${originalExpected}">`;
    cells[3].innerHTML = `<input type="number" value="${originalActual}">`;
    
    
    cells[4].innerHTML = `
        <button class="save-btn" data-id="${planId}">Save</button>
        <button class="cancel-btn" data-id="${planId}">Cancel</button>
    `;
    
    // Add event listeners
    row.querySelector(".save-btn").addEventListener("click", async (e) => {
        await savePlanChanges(planId, row);
    });
    
    row.querySelector(".cancel-btn").addEventListener("click", () => {
        fetchAndDisplayExpenses(); 
    });
}

async function savePlanChanges(planId, row) {
    try {
        const token = localStorage.getItem('token');
        const inputs = row.querySelectorAll("input");
        
        const updatedPlan = {
            task: inputs[0].value,
            date: inputs[1].value,
            expectedExpenses: parseFloat(inputs[2].value),
            actualExpenses: parseFloat(inputs[3].value)
        };

        const response = await fetch(`/api/plan/updatePlan/${planId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(updatedPlan)
        });

        if (!response.ok) throw new Error("Failed to update plan");
        
        alert("Plan updated successfully!");
        await fetchAndDisplayExpenses();
    } catch (error) {
        console.error("Error updating plan:", error);
        alert("Failed to update plan. Please try again.");
    }
}

async function handleDoneToggle(e) {
    const button = e.target;
    const planId = button.getAttribute("data-id");
    const isDone = button.getAttribute("data-done") === "true";
    
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login';
            return;
        }

        const response = await fetch(`/api/plan/toggleDone/${planId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ done: !isDone })
        });

        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || "Failed to update status");
        }

        button.setAttribute("data-done", !isDone);
        button.textContent = !isDone ? '✓ Done' : 'Mark Done';
        button.classList.toggle('done-active');
        
        const row = button.closest('tr');
        row.classList.toggle('completed-plan');

    } catch (error) {
        console.error("Error toggling done status:", error);
        alert(error.message || "Failed to update status");
    }
}

async function handleDeletePlan(e) {
    if (!confirm("Are you sure you want to delete this plan?")) return;
    
    try {
        const planId = e.target.getAttribute("data-id");
        const token = localStorage.getItem('token');
        
        const response = await fetch(`/api/plan/deletePlan/${planId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error("Failed to delete plan");
        
        alert("Plan deleted successfully!");
        await fetchAndDisplayExpenses();
    } catch (error) {
        console.error("Error deleting plan:", error);
        alert("Failed to delete plan. Please try again.");
    }
}