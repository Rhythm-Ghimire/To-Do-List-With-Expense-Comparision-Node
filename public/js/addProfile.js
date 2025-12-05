document.addEventListener("DOMContentLoaded", async function() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login';
            return;
        }

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
}); 

document.getElementById("saveProfile").addEventListener("click", async function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const address = document.getElementById("address").value;
    const phone = document.getElementById("phone").value;
    const token = localStorage.getItem('token');

    if (!token) {
        alert('Please login first');
        window.location.href = '/login';
        return;
    }

    try {
        const response = await fetch("/api/profile/saveProfile", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ username, address, phone })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.msg || "Failed to save profile");
        }

        alert("Profile saved successfully.");
        location.reload();
    } catch (error) {
        console.error("Error saving profile:", error);
        alert(error.message || "Error saving profile");
    }
});