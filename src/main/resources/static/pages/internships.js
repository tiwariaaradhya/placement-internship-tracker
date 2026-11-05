
const API_URL = window.location.origin + "/internships";

let allInternships = [];

const internshipsTable = document.getElementById("internshipsTable");
const internshipModal = document.getElementById("internshipModal");
const internshipForm = document.getElementById("internshipForm");
const searchInput = document.getElementById("searchInput");

// Escape HTML
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

// Toast notification
function showToast(message, isError = false) {
    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.style.borderLeftColor = isError
        ? "var(--danger)"
        : "var(--accent)";

    toast.classList.add("show");

    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

// Common API function - handles JSON and plain-text responses
async function apiRequest(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        }
    });

    const responseText = await response.text();

    let data = null;

    if (responseText) {
        try {
            data = JSON.parse(responseText);
        } catch {
            data = responseText;
        }
    }

    if (!response.ok) {
        const message = typeof data === "string"
            ? data
            : data?.message || `HTTP Error ${response.status}`;

        throw new Error(message);
    }

    return data;
}

// LOAD INTERNSHIPS
async function loadInternships() {
    internshipsTable.innerHTML = `
        <tr>
            <td colspan="8" class="empty-state">Loading internships...</td>
        </tr>
    `;

    try {
        const data = await apiRequest(API_URL);

        allInternships = Array.isArray(data) ? data : [];

        renderInternships(allInternships);
    } catch (error) {
        console.error("Load internships error:", error);

        internshipsTable.innerHTML = `
            <tr>
                <td colspan="8" class="empty-state">
                    Unable to load internships. Check backend connection.
                </td>
            </tr>
        `;

        showToast("Failed to load internships", true);
    }
}

// RENDER TABLE
function renderInternships(internships) {
    document.getElementById("internshipCount").textContent =
        `${internships.length} Internships`;

    if (internships.length === 0) {
        internshipsTable.innerHTML = `
            <tr>
                <td colspan="8" class="empty-state">
                    No internships found. Add your first internship!
                </td>
            </tr>
        `;
        return;
    }

    internshipsTable.innerHTML = internships.map(internship => `
        <tr>
            <td class="internship-id">#${escapeHTML(internship.id)}</td>
            <td class="internship-title">${escapeHTML(internship.title)}</td>
            <td>${escapeHTML(internship.companyId)}</td>
            <td>${escapeHTML(internship.location)}</td>
            <td>₹${escapeHTML(internship.stipend)}</td>
            <td>${escapeHTML(internship.duration)}</td>
            <td class="skills-cell">${escapeHTML(internship.requiredSkills)}</td>
            <td>
                <div class="action-group">
                    <button class="action-btn"
                        onclick="editInternship(${Number(internship.id)})">
                        Edit
                    </button>
                    <button class="action-btn delete-btn"
                        onclick="deleteInternship(${Number(internship.id)})">
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    `).join("");
}

// OPEN MODAL
function openModal(internship = null) {
    internshipForm.reset();

    if (internship) {
        document.getElementById("modalTitle").textContent = "Edit Internship";
        document.getElementById("internshipId").value = internship.id;
        document.getElementById("internshipTitle").value = internship.title ?? "";
        document.getElementById("companyId").value = internship.companyId ?? "";
        document.getElementById("internshipLocation").value = internship.location ?? "";
        document.getElementById("stipend").value = internship.stipend ?? "";
        document.getElementById("duration").value = internship.duration ?? "";
        document.getElementById("requiredSkills").value = internship.requiredSkills ?? "";
        document.getElementById("saveBtn").textContent = "Update Internship";
    } else {
        document.getElementById("modalTitle").textContent = "Add Internship";
        document.getElementById("internshipId").value = "";
        document.getElementById("saveBtn").textContent = "Save Internship";
    }

    internshipModal.classList.add("show");
}

// CLOSE MODAL
function closeModal() {
    internshipModal.classList.remove("show");
}

document.getElementById("addInternshipBtn")
    .addEventListener("click", () => openModal());

document.getElementById("cancelBtn")
    .addEventListener("click", closeModal);

internshipModal.addEventListener("click", event => {
    if (event.target === internshipModal) {
        closeModal();
    }
});

// ADD / UPDATE INTERNSHIP
internshipForm.addEventListener("submit", async event => {
    event.preventDefault();

    const id = document.getElementById("internshipId").value;

    const internship = {
        title: document.getElementById("internshipTitle").value.trim(),
        companyId: Number(document.getElementById("companyId").value),
        location: document.getElementById("internshipLocation").value.trim(),
        stipend: Number(document.getElementById("stipend").value),
        duration: document.getElementById("duration").value.trim(),
        requiredSkills: document.getElementById("requiredSkills").value.trim()
    };

    if (
        !internship.title ||
        !Number.isInteger(internship.companyId) ||
        internship.companyId <= 0 ||
        !internship.location ||
        !internship.duration ||
        !internship.requiredSkills ||
        !Number.isFinite(internship.stipend) ||
        internship.stipend < 0
    ) {
        showToast("Please enter valid internship details", true);
        return;
    }

    const saveButton = document.getElementById("saveBtn");
    saveButton.disabled = true;

    try {
        if (id) {
            await apiRequest(`${API_URL}/${id}`, {
                method: "PUT",
                body: JSON.stringify(internship)
            });

            showToast("Internship updated successfully!");
        } else {
            await apiRequest(API_URL, {
                method: "POST",
                body: JSON.stringify(internship)
            });

            showToast("Internship added successfully!");
        }

        closeModal();
        await loadInternships();

    } catch (error) {
        console.error("Save internship error:", error);
        showToast(error.message || "Unable to save internship", true);
    } finally {
        saveButton.disabled = false;
    }
});

// EDIT INTERNSHIP
function editInternship(id) {
    const internship = allInternships.find(
        item => Number(item.id) === Number(id)
    );

    if (internship) {
        openModal(internship);
    }
}

// DELETE INTERNSHIP
async function deleteInternship(id) {
    if (!confirm("Are you sure you want to delete this internship?")) {
        return;
    }

    try {
        await apiRequest(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        showToast("Internship deleted successfully!");
        await loadInternships();

    } catch (error) {
        console.error("Delete internship error:", error);
        showToast(error.message || "Unable to delete internship", true);
    }
}

// SEARCH INTERNSHIPS
searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();

    const filtered = allInternships.filter(internship =>
        String(internship.title ?? "").toLowerCase().includes(query) ||
        String(internship.location ?? "").toLowerCase().includes(query) ||
        String(internship.requiredSkills ?? "").toLowerCase().includes(query) ||
        String(internship.companyId ?? "").toLowerCase().includes(query)
    );

    renderInternships(filtered);
});

// INITIAL LOAD
loadInternships();
