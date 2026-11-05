
const API_URL = "/companies";

let allCompanies = [];

const companiesTable = document.getElementById("companiesTable");
const companyModal = document.getElementById("companyModal");
const companyForm = document.getElementById("companyForm");
const searchInput = document.getElementById("searchInput");

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

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

// API REQUEST
async function apiRequest(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        }
    });

    const responseText = await response.text();

    if (!response.ok) {
        throw new Error(responseText || `HTTP ${response.status}`);
    }

    if (!responseText.trim()) {
        return null;
    }

    try {
        return JSON.parse(responseText);
    } catch {
        return responseText;
    }
}

// LOAD COMPANIES
async function loadCompanies() {
    companiesTable.innerHTML = `
        <tr>
            <td colspan="6" class="empty-state">Loading companies...</td>
        </tr>
    `;

    try {
        const data = await apiRequest(API_URL);

        if (!Array.isArray(data)) {
            throw new Error("Companies API did not return a JSON array.");
        }

        allCompanies = data;
        renderCompanies(allCompanies);

    } catch (error) {
        console.error("Load companies error:", error);

        companiesTable.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    Unable to load companies.
                </td>
            </tr>
        `;

        showToast("Failed to load companies", true);
    }
}

// RENDER COMPANIES
function renderCompanies(companies) {
    document.getElementById("companyCount").textContent =
        `${companies.length} Companies`;

    if (companies.length === 0) {
        companiesTable.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    No companies found. Add your first company!
                </td>
            </tr>
        `;
        return;
    }

    companiesTable.innerHTML = companies.map(company => {
        const website = String(company.website ?? "").trim();

        const safeWebsite = /^https?:\/\//i.test(website)
            ? website
            : "";

        return `
            <tr>
                <td class="company-id">#${escapeHTML(company.id)}</td>
                <td class="company-name">${escapeHTML(company.name)}</td>
                <td>${escapeHTML(company.location)}</td>
                <td>${escapeHTML(company.industry)}</td>
                <td>
                    ${
                        safeWebsite
                            ? `<a class="company-website"
                                href="${escapeHTML(safeWebsite)}"
                                target="_blank"
                                rel="noopener noreferrer">
                                Visit Website ↗
                               </a>`
                            : escapeHTML(website || "—")
                    }
                </td>
                <td>
                    <div class="action-group">
                        <button class="action-btn"
                            onclick="editCompany(${Number(company.id)})">
                            Edit
                        </button>
                        <button class="action-btn delete-btn"
                            onclick="deleteCompany(${Number(company.id)})">
                            Delete
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join("");
}

// OPEN MODAL
function openModal(company = null) {
    companyForm.reset();

    if (company) {
        document.getElementById("modalTitle").textContent = "Edit Company";
        document.getElementById("companyId").value = company.id;
        document.getElementById("companyName").value = company.name ?? "";
        document.getElementById("companyLocation").value = company.location ?? "";
        document.getElementById("companyIndustry").value = company.industry ?? "";
        document.getElementById("companyWebsite").value = company.website ?? "";
        document.getElementById("saveBtn").textContent = "Update Company";
    } else {
        document.getElementById("modalTitle").textContent = "Add Company";
        document.getElementById("companyId").value = "";
        document.getElementById("saveBtn").textContent = "Save Company";
    }

    companyModal.classList.add("show");
}

// CLOSE MODAL
function closeModal() {
    companyModal.classList.remove("show");
}

document.getElementById("addCompanyBtn").addEventListener("click", () => {
    openModal();
});

document.getElementById("cancelBtn").addEventListener("click", closeModal);

companyModal.addEventListener("click", event => {
    if (event.target === companyModal) {
        closeModal();
    }
});

// ADD / UPDATE COMPANY
companyForm.addEventListener("submit", async event => {
    event.preventDefault();

    const id = document.getElementById("companyId").value;

    const company = {
        name: document.getElementById("companyName").value.trim(),
        location: document.getElementById("companyLocation").value.trim(),
        industry: document.getElementById("companyIndustry").value.trim(),
        website: document.getElementById("companyWebsite").value.trim()
    };

    if (!company.name || !company.location || !company.industry) {
        showToast("Please fill all required fields", true);
        return;
    }

    const saveButton = document.getElementById("saveBtn");
    saveButton.disabled = true;

    try {
        if (id) {
            await apiRequest(`${API_URL}/${id}`, {
                method: "PUT",
                body: JSON.stringify(company)
            });

            showToast("Company updated successfully!");
        } else {
            await apiRequest(API_URL, {
                method: "POST",
                body: JSON.stringify(company)
            });

            showToast("Company added successfully!");
        }

        closeModal();
        await loadCompanies();

    } catch (error) {
        console.error("Save company error:", error);
        showToast("Unable to save company: " + error.message, true);

    } finally {
        saveButton.disabled = false;
    }
});

// EDIT COMPANY
function editCompany(id) {
    const company = allCompanies.find(
        item => Number(item.id) === Number(id)
    );

    if (company) {
        openModal(company);
    }
}

// DELETE COMPANY
async function deleteCompany(id) {
    if (!confirm("Are you sure you want to delete this company?")) {
        return;
    }

    try {
        await apiRequest(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        showToast("Company deleted successfully!");
        await loadCompanies();

    } catch (error) {
        console.error("Delete company error:", error);
        showToast("Unable to delete company: " + error.message, true);
    }
}

// SEARCH COMPANIES
searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();

    const filtered = allCompanies.filter(company =>
        String(company.name ?? "").toLowerCase().includes(query) ||
        String(company.location ?? "").toLowerCase().includes(query) ||
        String(company.industry ?? "").toLowerCase().includes(query)
    );

    renderCompanies(filtered);
});

// INITIAL LOAD
loadCompanies();
