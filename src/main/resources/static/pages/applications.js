
const API_URL = "/applications";

const tableBody = document.getElementById("applicationsTableBody");
const modal = document.getElementById("applicationModal");
const form = document.getElementById("applicationForm");

let applications = [];

// API helper: JSON aur plain-text dono responses handle karega.
async function apiRequest(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        }
    });

    const responseText = await response.text();

    let data = responseText;

    try {
        data = responseText ? JSON.parse(responseText) : null;
    } catch {
        // Backend plain text response ko bhi safely handle karo.
    }

    if (!response.ok) {
        throw new Error(
            typeof data === "string" ? data : "Request failed"
        );
    }

    return data;
}

// Load all applications
async function loadApplications() {
    try {
        applications = await apiRequest(API_URL);

        if (!Array.isArray(applications)) {
            applications = [];
        }

        renderApplications();
    } catch (error) {
        console.error("Load applications error:", error);

        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="applications-message">
                    Unable to load applications. Please refresh the page.
                </td>
            </tr>
        `;
    }
}

// Render table
function renderApplications(data = applications) {
    if (!data.length) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="applications-message">
                    No applications found. Click + Add Application to begin.
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = data.map(application => {
        const status = String(application.status || "Pending");
        const statusClass = status.toLowerCase();

        return `
            <tr>
                <td>#${application.id}</td>
                <td>${application.studentId}</td>
                <td>${application.internshipId}</td>
                <td>${application.applicationDate || "-"}</td>
                <td>
                    <span class="app-status ${statusClass}">
                        ${status}
                    </span>
                </td>
                <td>
                    <button class="app-action"
                        onclick="editApplication(${application.id})">
                        Edit
                    </button>

                    <button class="app-action delete"
                        onclick="deleteApplication(${application.id})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    }).join("");
}

// Open modal
function openModal() {
    modal.classList.add("show");
}

// Close modal
function closeModal() {
    modal.classList.remove("show");
    form.reset();
    document.getElementById("applicationId").value = "";
    document.getElementById("applicationModalTitle").textContent =
        "Add Application";
}

// Add button
document.getElementById("addApplicationBtn").addEventListener("click", () => {
    closeModal();

    // Set today's date by default
    document.getElementById("applicationDate").value =
        new Date().toISOString().split("T")[0];

    openModal();
});

// Cancel button
document.getElementById("cancelApplicationBtn").addEventListener("click", closeModal);

// Close modal by clicking outside
modal.addEventListener("click", event => {
    if (event.target === modal) {
        closeModal();
    }
});

// Add / Update application
form.addEventListener("submit", async event => {
    event.preventDefault();

    const id = document.getElementById("applicationId").value;

    const applicationData = {
        studentId: Number(document.getElementById("studentId").value),
        internshipId: Number(document.getElementById("internshipId").value),
        applicationDate: document.getElementById("applicationDate").value,
        status: document.getElementById("applicationStatus").value
    };

    const saveButton = document.getElementById("saveApplicationBtn");

    try {
        saveButton.disabled = true;
        saveButton.textContent = "Saving...";

        if (id) {
            await apiRequest(`${API_URL}/${id}`, {
                method: "PUT",
                body: JSON.stringify(applicationData)
            });
        } else {
            await apiRequest(API_URL, {
                method: "POST",
                body: JSON.stringify(applicationData)
            });
        }

        closeModal();
        await loadApplications();

    } catch (error) {
        console.error("Save application error:", error);
        alert("Unable to save application: " + error.message);
    } finally {
        saveButton.disabled = false;
        saveButton.textContent = "Save Application";
    }
});

// Edit application
function editApplication(id) {
    const application = applications.find(item => item.id === id);

    if (!application) return;

    document.getElementById("applicationId").value = application.id;
    document.getElementById("studentId").value = application.studentId;
    document.getElementById("internshipId").value = application.internshipId;
    document.getElementById("applicationDate").value =
        application.applicationDate || "";
    document.getElementById("applicationStatus").value =
        application.status || "Pending";

    document.getElementById("applicationModalTitle").textContent =
        "Edit Application";

    openModal();
}

// Delete application
async function deleteApplication(id) {
    const confirmed = confirm(
        "Are you sure you want to delete this application?"
    );

    if (!confirmed) return;

    try {
        await apiRequest(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        await loadApplications();

    } catch (error) {
        console.error("Delete application error:", error);
        alert("Unable to delete application: " + error.message);
    }
}

// Search applications
document.getElementById("searchApplication").addEventListener("input", event => {
    const searchValue = event.target.value.toLowerCase();

    const filteredApplications = applications.filter(application =>
        String(application.id).includes(searchValue) ||
        String(application.studentId).includes(searchValue) ||
        String(application.internshipId).includes(searchValue) ||
        String(application.applicationDate).toLowerCase().includes(searchValue) ||
        String(application.status).toLowerCase().includes(searchValue)
    );

    renderApplications(filteredApplications);
});

// Initial load
loadApplications();
