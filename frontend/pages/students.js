
const API_URL = window.location.origin + "/students";

let allStudents = [];

const studentsTable = document.getElementById("studentsTable");
const studentModal = document.getElementById("studentModal");
const studentForm = document.getElementById("studentForm");
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

// Common API function - handles JSON and plain text
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
        const errorMessage =
            typeof data === "string"
                ? data
                : data?.message || `HTTP Error ${response.status}`;

        throw new Error(errorMessage);
    }

    return data;
}

// Load students
async function loadStudents() {
    studentsTable.innerHTML = `
        <tr>
            <td colspan="6" class="empty-state">Loading students...</td>
        </tr>
    `;

    try {
        const data = await apiRequest(API_URL);

        allStudents = Array.isArray(data) ? data : [];

        renderStudents(allStudents);

    } catch (error) {
        console.error("Load students error:", error);

        studentsTable.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    Unable to load students. Check backend connection.
                </td>
            </tr>
        `;

        showToast("Failed to load students", true);
    }
}

// Render students
function renderStudents(students) {
    document.getElementById("studentCount").textContent =
        `${students.length} Students`;

    if (students.length === 0) {
        studentsTable.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    No students found. Add your first student!
                </td>
            </tr>
        `;
        return;
    }

    studentsTable.innerHTML = students.map(student => `
        <tr>
            <td class="student-id">#${escapeHTML(student.id)}</td>
            <td class="student-name">${escapeHTML(student.name)}</td>
            <td>${escapeHTML(student.email)}</td>
            <td>${escapeHTML(student.branch)}</td>
            <td>${escapeHTML(student.graduationYear)}</td>
            <td>
                <div class="action-group">
                    <button
                        class="action-btn"
                        onclick="editStudent(${Number(student.id)})">
                        Edit
                    </button>

                    <button
                        class="action-btn delete-btn"
                        onclick="deleteStudent(${Number(student.id)})">
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    `).join("");
}

// Open modal
function openModal(student = null) {
    studentForm.reset();

    if (student) {
        document.getElementById("modalTitle").textContent = "Edit Student";

        document.getElementById("studentId").value = student.id;
        document.getElementById("studentName").value = student.name ?? "";
        document.getElementById("studentEmail").value = student.email ?? "";
        document.getElementById("studentBranch").value = student.branch ?? "";
        document.getElementById("graduationYear").value =
            student.graduationYear ?? "";

        document.getElementById("saveBtn").textContent = "Update Student";

    } else {
        document.getElementById("modalTitle").textContent = "Add Student";
        document.getElementById("studentId").value = "";
        document.getElementById("saveBtn").textContent = "Save Student";
    }

    studentModal.classList.add("show");
}

// Close modal
function closeModal() {
    studentModal.classList.remove("show");
}

// Add student button
document.getElementById("addStudentBtn").addEventListener("click", () => {
    openModal();
});

// Cancel button
document.getElementById("cancelBtn").addEventListener("click", closeModal);

// Close modal outside click
studentModal.addEventListener("click", event => {
    if (event.target === studentModal) {
        closeModal();
    }
});

// Save / Update student
studentForm.addEventListener("submit", async event => {
    event.preventDefault();

    const id = document.getElementById("studentId").value;

    const student = {
        name: document.getElementById("studentName").value.trim(),
        email: document.getElementById("studentEmail").value.trim(),
        branch: document.getElementById("studentBranch").value.trim(),
        graduationYear: Number(
            document.getElementById("graduationYear").value
        )
    };

    if (
        !student.name ||
        !student.email ||
        !student.branch ||
        !student.graduationYear
    ) {
        showToast("Please fill all fields", true);
        return;
    }

    const saveButton = document.getElementById("saveBtn");

    saveButton.disabled = true;

    try {
        if (id) {
            await apiRequest(`${API_URL}/${id}`, {
                method: "PUT",
                body: JSON.stringify(student)
            });

            showToast("Student updated successfully!");

        } else {
            await apiRequest(API_URL, {
                method: "POST",
                body: JSON.stringify(student)
            });

            showToast("Student added successfully!");
        }

        closeModal();

        // Immediately refresh table after successful operation
        await loadStudents();

    } catch (error) {
        console.error("Save student error:", error);
        showToast(error.message || "Unable to save student", true);

    } finally {
        saveButton.disabled = false;
    }
});

// Edit student
function editStudent(id) {
    const student = allStudents.find(
        item => Number(item.id) === Number(id)
    );

    if (student) {
        openModal(student);
    }
}

// Delete student
async function deleteStudent(id) {
    if (!confirm("Are you sure you want to delete this student?")) {
        return;
    }

    try {
        await apiRequest(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        showToast("Student deleted successfully!");

        // Immediately refresh table after deletion
        await loadStudents();

    } catch (error) {
        console.error("Delete student error:", error);
        showToast(error.message || "Unable to delete student", true);
    }
}

// Search students
searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();

    const filteredStudents = allStudents.filter(student => {
        return (
            String(student.name ?? "").toLowerCase().includes(query) ||
            String(student.email ?? "").toLowerCase().includes(query) ||
            String(student.branch ?? "").toLowerCase().includes(query)
        );
    });

    renderStudents(filteredStudents);
});

// Initial page load
loadStudents();
