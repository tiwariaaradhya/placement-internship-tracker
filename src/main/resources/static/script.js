
const API_URL = "http://localhost:8080";

const setText = (id, value) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value ?? 0;
};

// Fetch dashboard statistics
async function loadDashboard() {
    const response = await fetch(`${API_URL}/dashboard`);

    if (!response.ok) {
        throw new Error("Could not fetch dashboard statistics");
    }

    const data = await response.json();

    setText("totalStudents", data.totalStudents);
    setText("totalCompanies", data.totalCompanies);
    setText("totalInternships", data.totalInternships);
    setText("totalApplications", data.totalApplications);

    setText("quickStudents", data.totalStudents);
    setText("quickCompanies", data.totalCompanies);
    setText("quickInternships", data.totalInternships);
    setText("quickApplications", data.totalApplications);

    const pending = Number(data.pendingApplications ?? 0);
    const accepted = Number(data.acceptedApplications ?? 0);
    const rejected = Number(data.rejectedApplications ?? 0);

    const total = pending + accepted + rejected;

    setText("statusTotal", `${total} applications`);
    setText("pendingApplications", pending);
    setText("acceptedApplications", accepted);
    setText("rejectedApplications", rejected);

    updateStatusBar(pending, accepted, rejected, total);
}

// Update status progress
function updateStatusBar(pending, accepted, rejected, total) {
    const items = [
        { id: "pendingBar", count: pending, percentId: "pendingPercent" },
        { id: "acceptedBar", count: accepted, percentId: "acceptedPercent" },
        { id: "rejectedBar", count: rejected, percentId: "rejectedPercent" }
    ];

    items.forEach(item => {
        const percent = total > 0
            ? (item.count / total) * 100
            : 0;

        document.getElementById(item.id).style.width = `${percent}%`;

        setText(
            item.percentId,
            `${percent.toFixed(1)}% of applications`
        );
    });
}

// Fetch recent applications
async function loadApplications() {
    const table = document.getElementById("applicationsTable");

    const response = await fetch(`${API_URL}/applications`);

    if (!response.ok) {
        throw new Error("Could not fetch applications");
    }

    const applications = await response.json();

    table.replaceChildren();

    if (!applications.length) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 5;
        cell.className = "empty-state";
        cell.textContent = "No applications found yet.";

        row.appendChild(cell);
        table.appendChild(row);
        return;
    }

    const recent = [...applications]
        .sort((a, b) => Number(b.id) - Number(a.id))
        .slice(0, 5);

    recent.forEach(application => {
        const row = document.createElement("tr");

        const idCell = document.createElement("td");
        idCell.textContent = `#APP-${application.id ?? "-"}`;
        idCell.className = "app-id";
        row.appendChild(idCell);

        const studentCell = document.createElement("td");
        studentCell.textContent = application.studentId ?? "-";
        row.appendChild(studentCell);

        const internshipCell = document.createElement("td");
        internshipCell.textContent = application.internshipId ?? "-";
        row.appendChild(internshipCell);

        const dateCell = document.createElement("td");
        dateCell.textContent = application.applicationDate ?? "-";
        row.appendChild(dateCell);

        const statusCell = document.createElement("td");
        const badge = document.createElement("span");

        const status = String(application.status ?? "Unknown");
        const normalized = status.toLowerCase();

        badge.className = "status-badge";

        if (normalized === "pending") {
            badge.classList.add("status-pending");
        } else if (normalized === "accepted") {
            badge.classList.add("status-accepted");
        } else if (normalized === "rejected") {
            badge.classList.add("status-rejected");
        } else {
            badge.classList.add("status-other");
        }

        badge.textContent = status;
        statusCell.appendChild(badge);
        row.appendChild(statusCell);

        table.appendChild(row);
    });
}

// Refresh dashboard
async function refreshDashboard() {
    const button = document.getElementById("refreshButton");

    button.disabled = true;
    button.innerHTML = "<span>↻</span> Loading...";

    try {
        await Promise.all([
            loadDashboard(),
            loadApplications()
        ]);
    } catch (error) {
        console.error("Dashboard error:", error);

        const table = document.getElementById("applicationsTable");
        table.replaceChildren();

        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 5;
        cell.className = "empty-state";
        cell.textContent =
            "Unable to load data. Check whether the backend is running.";

        row.appendChild(cell);
        table.appendChild(row);
    } finally {
        button.disabled = false;
        button.innerHTML = "<span>↻</span> Refresh data";
    }
}

document.getElementById("refreshButton")
    .addEventListener("click", refreshDashboard);

refreshDashboard();
