
const API_URL = "https://cloud-computing-ca2-api.onrender.com";

async function checkStatus() {
    try {
        const response = await fetch(`${API_URL}/api/health`);
        const data = await response.json();

        document.getElementById("backend").textContent = "Online";
        document.getElementById("database").textContent = data.database;
    } catch (error) {
        document.getElementById("backend").textContent = "Offline";
        document.getElementById("database").textContent = "Disconnected";
    }
}

async function publishAnnouncement() {
    const title = document.getElementById("title").value.trim();
    const message = document.getElementById("message").value.trim();
    const result = document.getElementById("result");

    if (!title || !message) {
        result.textContent = "Please enter both title and message.";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/announcements`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title, message })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to publish");
        }

        result.textContent = "Announcement published successfully!";
        document.getElementById("title").value = "";
        document.getElementById("message").value = "";

        loadAnnouncements();

    } catch (error) {
        result.textContent = "Error: " + error.message;
    }
}

async function loadAnnouncements() {
    const container = document.getElementById("announcements");

    try {
        const response = await fetch(`${API_URL}/api/announcements`);

        if (!response.ok) {
            throw new Error("Unable to load announcements");
        }

        const announcements = await response.json();

        container.replaceChildren();

        if (announcements.length === 0) {
            container.textContent = "No announcements published yet.";
            return;
        }

        announcements.forEach(item => {
            const card = document.createElement("div");
            card.className = "announcement";

            const heading = document.createElement("h3");
            heading.textContent = item.title;

            const description = document.createElement("p");
            description.textContent = item.message;

            const date = document.createElement("small");
            date.textContent = new Date(item.createdAt).toLocaleString();

            card.append(heading, description, date);
            container.appendChild(card);
        });

    } catch (error) {
        container.textContent = "Unable to load announcements.";
    }
}

checkStatus();
loadAnnouncements();

